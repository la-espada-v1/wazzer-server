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

themeToggle.onclick = () => {
  document.body.classList.toggle("light-theme");
  if (document.body.classList.contains("light-theme")) {
    themeToggle.innerText = "🌙 Dark Mode";
  } else {
    themeToggle.innerText = "☀️ Light Mode";
  }
};

lowHrSlider.oninput = () => { lowHrText.innerText = lowHrSlider.value; };
highHrSlider.oninput = () => { highHrText.innerText = highHrSlider.value; };

pulseSlider.oninput = () => {
  pulseText.innerText = pulseSlider.value;
  checkPulseLevel(); 
};

function checkPulseLevel() {
  const pulse = parseInt(pulseSlider.value);

  if (pulse > 110) {
    highHrSlider.value = 25;
    highHrText.innerText = 25;
  } else if (pulse < 50) {
    lowHrSlider.value = 38;
    lowHrText.innerText = 38;
  }
  
  sendMeasuresToBackend();
}

setInterval(() => {
  if (simulateToggle.checked) {
    let randomPulse = Math.floor(Math.random() * 100) + 50;
    let randomNoise = Math.floor(Math.random() * 60) + 30;

    pulseSlider.value = randomPulse;
    pulseText.innerText = randomPulse;
    noiseText.innerText = randomNoise;

    checkPulseLevel();
  }
}, 2000);

async function addContact() {
  const inputName = document.getElementById("fullName").value;
  const inputTelephone = document.getElementById("phone").value;

  if (!inputName || !inputTelephone) {
    alert("⚠️ Please fill in all fields!");
    return;
  }

  const contactData = { 
    name: inputName, 
    telephone: inputTelephone 
  };

  try {
    const response = await fetch('http://127.0.0.1:5000/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    if (response.ok) {
      contacts.push(contactData);
      renderContacts();
      clearInputs();
    } else {
      alert("⚠️ Възникна грешка при запазване в базата данни.");
    }
  } catch (error) {
    alert("⚠️ Не мога да се свържа със сървъра!");
  }
}

function renderContacts() {
  const list = document.getElementById("contactList");
  list.innerHTML = "";

  contacts.forEach((c, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <b>${c.name}</b><br>
      📞 ${c.telephone}<br>
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
  document.getElementById("fullName").value = c.name;
  document.getElementById("phone").value = c.telephone;
  deleteContact(index);
}

function clearInputs() {
  document.getElementById("fullName").value = "";
  document.getElementById("phone").value = "";
}

async function sendMeasuresToBackend() {
  const currentPulse = parseInt(pulseSlider.value);
  const currentLowTemp = parseInt(lowHrSlider.value);
  const currentHighTemp = parseInt(highHrSlider.value);
  const currentNoise = parseInt(document.getElementById("noiseValue").innerText);

  const measuresData = {
    pulse: currentPulse,
    low_water_temp: currentLowTemp,
    high_water_temp: currentHighTemp,
    noise: currentNoise
  };

  try {
    await fetch('http://127.0.0.1:5000/measures', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(measuresData)
    });
  } catch (error) {
    console.error(error);
  }
}