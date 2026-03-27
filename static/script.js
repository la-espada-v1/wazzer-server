const backendIP = "127.0.0.1";
const API_URL = `http://${backendIP}:5000`;


const themeToggle = document.getElementById("themeToggle");

const pulseMinSlider = document.getElementById("pulseMinSlider");
const pulseMaxSlider = document.getElementById("pulseMaxSlider");
const pulseMinValue = document.getElementById("pulseMinValue");
const pulseMaxValue = document.getElementById("pulseMaxValue");

const lowHrSlider = document.getElementById("lowHrSlider");
const regularHrSlider = document.getElementById("regularHrSlider");
const highHrSlider = document.getElementById("highHrSlider");

const lowHrValue = document.getElementById("lowHrValue");
const regularHrValue = document.getElementById("regularHrValue");
const highHrValue = document.getElementById("highHrValue");

let contacts = [];


window.onload = async () => {
  try {
    const response = await fetch(`${API_URL}/contact`);
    if (response.ok) {
      contacts = await response.json();
      renderContacts();
    }
  } catch (e) {
    console.error("Connection error:", e);
  }
};


themeToggle.onclick = () => {
  document.body.classList.toggle("light-theme");
  themeToggle.innerText = document.body.classList.contains("light-theme") ? "Dark Mode" : "Light Mode";
};


lowHrSlider.oninput = () => { lowHrValue.innerText = lowHrSlider.value; };
regularHrSlider.oninput = () => { regularHrValue.innerText = regularHrSlider.value; };
highHrSlider.oninput = () => { highHrValue.innerText = highHrSlider.value; };


pulseMinSlider.oninput = () => {
    let minVal = parseInt(pulseMinSlider.value);
    let maxVal = parseInt(pulseMaxSlider.value);
    
    
    if (minVal >= maxVal) {
        pulseMinSlider.value = maxVal - 1;
        minVal = maxVal - 1;
    }
    pulseMinValue.innerText = minVal;
};

pulseMaxSlider.oninput = () => {
    let minVal = parseInt(pulseMinSlider.value);
    let maxVal = parseInt(pulseMaxSlider.value);
    
    
    if (maxVal <= minVal) {
        pulseMaxSlider.value = minVal + 1;
        maxVal = minVal + 1;
    }
    pulseMaxValue.innerText = maxVal;
};


async function updateServerConfig(configKey, configValue) {
    try {
        
        await fetch(`${API_URL}/config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: configKey, value: parseFloat(configValue) })
        });
        console.log(`Updated ${configKey} to ${configValue}`);
    } catch (e) {
        console.error("Failed to update server config:", e);
    }
}


lowHrSlider.addEventListener('change', (e) => updateServerConfig("water_temp_low_hr", e.target.value));
regularHrSlider.addEventListener('change', (e) => updateServerConfig("water_temp_regular_hr", e.target.value));
highHrSlider.addEventListener('change', (e) => updateServerConfig("water_temp_high_hr", e.target.value));
pulseMinSlider.addEventListener('change', (e) => updateServerConfig("pulse_limit_min", e.target.value));
pulseMaxSlider.addEventListener('change', (e) => updateServerConfig("pulse_limit_max", e.target.value));


async function addContact() {
  const inputName = document.getElementById("fullName").value.trim();
  const inputTelephone = document.getElementById("phone").value.trim();

  if (!inputName || !inputTelephone) {
    alert("Please fill in all the fields!");
    return;
  }

  if (inputTelephone[0] !== "0") {
    alert("Error: The phone number needs to start with an '0'!");
    return; 
  }


  if (inputTelephone.length > 10) {
    alert("Error: The phone number can not be longer than 10 digits!");
    return;
  }
  if (inputTelephone.length < 10) {
    alert("Error: The phone number can not be shorter than 10 digits!");
    return;
  }

  
  for (let i = 0; i < inputTelephone.length; i++) {
    let char = inputTelephone[i];
    
    
    if (char < "0" || char > "9") {
      alert("Error: The phone number must contain only numbers!");
      return; 
    }
  }



  
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: inputName, telephone: inputTelephone })
    });

    if (response.ok) {
      const res = await fetch(`${API_URL}/contact`);
      contacts = await res.json();
      renderContacts();
      
      document.getElementById("fullName").value = "";
      document.getElementById("phone").value = "";
    }
  } catch (error) {
    alert("Error with server");
  }
}

function renderContacts() {
  const list = document.getElementById("contactList");
  list.innerHTML = "";
  contacts.forEach((c, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <b>${c.name}</b><br>
      <span style="font-size: 0.9rem; color: gray;">📞 ${c.telephone}</span><br>
      <button style="background: #ef4444; color: white; padding: 0.5rem; margin-top: 0.5rem; border: none; border-radius: 0.3rem; cursor: pointer;" onclick="deleteContact(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
}

async function deleteContact(index) {
  const idToDelete = contacts[index].id;
  try {
    const response = await fetch(`${API_URL}/contact/${idToDelete}`, { method: 'DELETE' });
    if (response.ok) {
      contacts.splice(index, 1);
      renderContacts();
    }
  } catch (e) {
    alert("Database error!");
  }
}