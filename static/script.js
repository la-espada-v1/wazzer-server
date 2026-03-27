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
        const resContacts = await fetch(`${API_URL}/contact`);
        if (resContacts.ok) {
            contacts = await resContacts.json();
            renderContacts();
        }
    } catch (e) { console.error("Contact error:", e); }


    try {
        const resConfig = await fetch(`${API_URL}/configuration`);
        if (resConfig.ok) {
            const config = await resConfig.json();
            
            if (config.lowHR) {
                pulseMinSlider.value = config.lowHR;
                pulseMinValue.innerText = config.lowHR;
            }
            if (config.highHR) {
                pulseMaxSlider.value = config.highHR;
                pulseMaxValue.innerText = config.highHR;
            }
            if (config.lowHRTemperature) {
                lowHrSlider.value = config.lowHRTemperature;
                lowHrValue.innerText = config.lowHRTemperature;
            }
            if (config.regular) {
                regularHrSlider.value = config.regular;
                regularHrValue.innerText = config.regular;
            }
            if (config.high) {
                highHrSlider.value = config.high;
                highHrValue.innerText = config.high;
            }
        }
    } catch (e) { console.error("Config load error:", e); }
};

async function savePulseConfig() {
    const payload = {
        lowHR: parseFloat(pulseMinSlider.value),
        highHR: parseFloat(pulseMaxSlider.value)
    };
    try {
        await fetch(`${API_URL}/configuration/hr`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        console.log("Pulse config saved:", payload);
    } catch (e) { console.error("Error saving pulse config"); }
}


async function saveTempConfig() {
    const payload = {
        lowHRTemperature: parseFloat(lowHrSlider.value),
        regular: parseFloat(regularHrSlider.value),
        high: parseFloat(highHrSlider.value)
    };
    try {
        await fetch(`${API_URL}/configuration/temperature`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        console.log("Temp config saved:", payload);
    } catch (e) { console.error("Error saving temp config"); }
}

lowHrSlider.oninput = () => { lowHrValue.innerText = lowHrSlider.value; };
regularHrSlider.oninput = () => { regularHrValue.innerText = regularHrSlider.value; };
highHrSlider.oninput = () => { highHrValue.innerText = highHrSlider.value; };


lowHrSlider.onchange = saveTempConfig;
regularHrSlider.onchange = saveTempConfig;
highHrSlider.onchange = saveTempConfig;

pulseMinSlider.oninput = () => {
    let minVal = parseInt(pulseMinSlider.value);
    let maxVal = parseInt(pulseMaxSlider.value);
    if (minVal >= maxVal) {
        pulseMinSlider.value = maxVal - 1;
        minVal = maxVal - 1;
    }
    pulseMinValue.innerText = minVal;
};
pulseMinSlider.onchange = savePulseConfig; 

pulseMaxSlider.oninput = () => {
    let minVal = parseInt(pulseMinSlider.value);
    let maxVal = parseInt(pulseMaxSlider.value);
    if (maxVal <= minVal) {
        pulseMaxSlider.value = minVal + 1;
        maxVal = minVal + 1;
    }
    pulseMaxValue.innerText = maxVal;
};
pulseMaxSlider.onchange = savePulseConfig; 

themeToggle.onclick = () => {
    document.body.classList.toggle("light-theme");
    themeToggle.innerText = document.body.classList.contains("light-theme") ? "Dark Mode" : "Light Mode";
};

async function addContact() {
    const inputName = document.getElementById("fullName").value.trim();
    const inputTelephone = document.getElementById("phone").value.trim();

    if (!inputName || !inputTelephone) {
        alert("Please fill in all the fields!");
        return;
    }

    if (inputTelephone[0] !== "0" || inputTelephone.length !== 10) {
        alert("Error: Phone must start with '0' and be 10 digits!");
        return;
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
    } catch (error) { alert("Error with server"); }
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
    } catch (e) { alert("Database error!"); }
}