// --- КОНФИГУРАЦИЯ ---
const backendIP = "192.168.1.XX"; // Сложи ТВОЕТО IP тук!
const API_URL = `http://${backendIP}:5000`;

const pulseSlider = document.getElementById("pulseSlider");
const lowHrSlider = document.getElementById("lowHrSlider");
const highHrSlider = document.getElementById("highHrSlider");
const pulseText = document.getElementById("pulseValue");
const lowHrText = document.getElementById("lowHrValue");
const highHrText = document.getElementById("highHrValue");
const noiseText = document.getElementById("noiseValue");
const simulateToggle = document.getElementById("simulateToggle");
const themeToggle = document.getElementById("themeToggle");

let contacts = [];

// 1. ЗАРЕЖДАНЕ: Взима контактите от твоята SQLite база при пускане на сайта
window.onload = async () => {
  try {
    const response = await fetch(`${API_URL}/contact`);
    if (response.ok) {
      contacts = await response.json();
      renderContacts();
    }
  } catch (e) {
    console.error("Грешка при връзка с бекенда:", e);
  }
};

// ТЕМАТА
themeToggle.onclick = () => {
  document.body.classList.toggle("light-theme");
  themeToggle.innerText = document.body.classList.contains("light-theme") ? "🌙 Dark Mode" : "☀️ Light Mode";
};

// СЛАЙДЕРИТЕ
lowHrSlider.oninput = () => { lowHrText.innerText = lowHrSlider.value; };
highHrSlider.oninput = () => { highHrText.innerText = highHrSlider.value; };

pulseSlider.oninput = () => {
  pulseText.innerText = pulseSlider.value;
  checkPulseLevel(); 
};

// ЛОГИКА ЗА НИВАТА
function checkPulseLevel() {
  const pulse = parseInt(pulseSlider.value);
  if (pulse > 110) {
    highHrSlider.value = 25;
    highHrText.innerText = 25;
  } else if (pulse < 50) {
    lowHrSlider.value = 38;
    lowHrText.innerText = 38;
  }
  sendMeasuresToBackend(); // Праща данни към твоя Python
}

// СИМУЛАТОР
setInterval(() => {
  if (simulateToggle.checked) {
    let randomPulse = Math.floor(Math.random() * 100) + 50;
    let randomNoise = Math.floor(Math.random() * 60) + 30;
    pulseSlider.value = randomPulse;
    pulseText.innerText = randomPulse;
    noiseText.innerText = randomNoise;
    checkPulseLevel();
  }
}, 3000); // На всеки 3 секунди, за да не спамим SMS-ите твърде бързо

// ДОБАВЯНЕ НА КОНТАКТ (POST заявка към теб)
async function addContact() {
  const inputName = document.getElementById("fullName").value;
  const inputTelephone = document.getElementById("phone").value;

  if (!inputName || !inputTelephone) {
    alert("⚠️ Моля, попълнете всички полета!");
    return;
  }

  const contactData = { name: inputName, telephone: inputTelephone };

  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });

    if (response.ok) {
      // Опресняваме списъка, за да получим ID от базата
      const res = await fetch(`${API_URL}/contact`);
      contacts = await res.json();
      renderContacts();
      clearInputs();
    }
  } catch (error) {
    alert("⚠️ Сървърът не отговаря!");
  }
}

// ИЗЧИСЛЯВАНЕ НА СПИСЪКА (ВИЗУАЛИЗАЦИЯ)
function renderContacts() {
  const list = document.getElementById("contactList");
  list.innerHTML = "";
  contacts.forEach((c, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <b>${c.name}</b><br>
      📞 ${c.telephone}<br>
      <button style="background: #ef4444; color: white;" onclick="deleteContact(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
}

// ТРИЕНЕ (DELETE заявка към твоя Python)
async function deleteContact(index) {
  const idToDelete = contacts[index].id;
  try {
    const response = await fetch(`${API_URL}/contact/${idToDelete}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      contacts.splice(index, 1);
      renderContacts();
    }
  } catch (e) {
    alert("Грешка при триене от базата данни!");
  }
}

function clearInputs() {
  document.getElementById("fullName").value = "";
  document.getElementById("phone").value = "";
}

// ИЗПРАЩАНЕ НА ДАННИТЕ (Към твоя /measures)
async function sendMeasuresToBackend() {
  const currentPulse = parseInt(pulseSlider.value);
  const currentNoise = parseInt(noiseText.innerText);

  const measuresData = {
    bpm: currentPulse,
    soundVolume: currentNoise,
    bloodOxygen: 98 // Тестова стойност
  };

  try {
    await fetch(`${API_URL}/measures`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(measuresData)
    });
  } catch (error) {
    console.error("Грешка при пращане на мерки към бекенда.");
  }
}