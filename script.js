const pulseSlider = document.getElementById("pulseSlider");
const lowHrSlider = document.getElementById("lowHrSlider");
const highHrSlider = document.getElementById("highHrSlider");

const pulseText = document.getElementById("pulseValue");
const lowHrText = document.getElementById("lowHrValue");
const highHrText = document.getElementById("highHrValue");
const noiseText = document.getElementById("noiseValue");

const statusBox = document.getElementById("status");
const simulateToggle = document.getElementById("simulateToggle");
const themeToggle = document.getElementById("themeToggle");

let contacts = [];

/* ---------- СМЯНА НА ТЕМАТА ---------- */
themeToggle.onclick = () => {
  document.body.classList.toggle("light-theme");
  if (document.body.classList.contains("light-theme")) {
    themeToggle.innerText = "🌙 Dark Mode";
  } else {
    themeToggle.innerText = "☀️ Light Mode";
  }
};

/* ---------- СЛАЙДЕРИ ЗА ВОДАТА ---------- */
lowHrSlider.oninput = () => { lowHrText.innerText = lowHrSlider.value; };
highHrSlider.oninput = () => { highHrText.innerText = highHrSlider.value; };

pulseSlider.oninput = () => {
  pulseText.innerText = pulseSlider.value;
  checkStatus();
};

/* ---------- SIMULATION ---------- */
setInterval(() => {
  if (simulateToggle.checked) {
    let randomPulse = Math.floor(Math.random() * 100) + 50;
    let randomNoise = Math.floor(Math.random() * 60) + 30;

    pulseSlider.value = randomPulse;
    pulseText.innerText = randomPulse;
    noiseText.innerText = randomNoise;

    checkStatus();
  }
}, 2000);

/* ---------- STATUS LOGIC (МАГИЯТА ЗА БЕЗОПАСНОСТ) ---------- */
function checkStatus() {
  const pulse = parseInt(pulseSlider.value);

  if (pulse > 110) {
    // ОПАСНОСТ: ВИСОК ПУЛС
    statusBox.innerText = "DANGER: HIGH PULSE";
    statusBox.className = "status danger";

    // Автоматично пуска хладка вода
    highHrSlider.value = 25;
    highHrText.innerText = 25;

  } else if (pulse < 50) {
    // ОПАСНОСТ: НИСЪК ПУЛС
    statusBox.innerText = "DANGER: LOW PULSE";
    statusBox.className = "status danger";

    // Автоматично пуска по-топла вода
    lowHrSlider.value = 38;
    lowHrText.innerText = 38;

  } else {
    // НОРМАЛНО СЪСТОЯНИЕ
    statusBox.innerText = "SAFE";
    statusBox.className = "status safe";
  }
}

/* ---------- CONTACTS (CRUD) ---------- */
function addContact() {
  const name = document.getElementById("name").value;
  const family = document.getElementById("family").value;
  const phone = document.getElementById("phone").value;

  if (!name || !family || !phone) {
    alert("⚠️ Please fill in all fields!");
    return;
  }

  const contact = { name, family, phone };
  contacts.push(contact);
  renderContacts();
  clearInputs();
}

function renderContacts() {
  const list = document.getElementById("contactList");
  list.innerHTML = "";

  contacts.forEach((c, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <b>${c.name} ${c.family}</b><br>
      📞 ${c.phone}<br>
      <button onclick="editContact(${index})">Edit</button>
      <button style="background: #ef4444; color: white;" onclick="deleteContact(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
}

function deleteContact(index) {
  contacts.splice(index, 1);
  renderContacts();
}

function editContact(index) {
  const c = contacts[index];
  document.getElementById("name").value = c.name;
  document.getElementById("family").value = c.family;
  document.getElementById("phone").value = c.phone;
  deleteContact(index);
}

function clearInputs() {
  document.getElementById("name").value = "";
  document.getElementById("family").value = "";
  document.getElementById("phone").value = "";
}