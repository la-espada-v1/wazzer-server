
const backendIP = "127.0.0.1";
const API_URL = `http://${backendIP}:5000`;

const pulseSlider = document.getElementById("pulseSlider");
const lowHrSlider = document.getElementById("lowHrSlider");
const highHrSlider = document.getElementById("highHrSlider");
const pulseText = document.getElementById("pulseValue");
const lowHrText = document.getElementById("lowHrValue");
const highHrText = document.getElementById("highHrValue");
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