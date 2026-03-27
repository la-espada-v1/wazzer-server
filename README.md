<p align="center">
  <img width=256px src="https://raw.githubusercontent.com/la-espada-v1/wazzer-watch/refs/heads/main/app/src/main/icon-playstore.png" />
  <h1 align="center">Wazzer</h1>
  <p align="center">
    An intelligent IoT showerhead system designed for personal safety and health monitoring.
  </p>
</p>

<p align="center">
    <a href="https://github.com/la-espada-v1/wazzer-server/fork">
        <img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?color=FAA533&style=flat-square" alt="Contributions welcome badge" />
    </a>

</p>

---

## 🚀 Overview
**Wazzer** is an IoT (Internet of Things) solution developed to protect users with anemia or cardiovascular conditions during their daily routines. By monitoring heart rate (BPM) and body temperature in real-time, the system dynamically adjusts water temperature to prevent fainting, dizziness, or thermal shocks through automated safety logic.

## 🛠️ Tech Stack
* **Backend:** Python / Flask
* **Database:** SQLite & SQLAlchemy (Persistent Storage)
* **Frontend:** JavaScript (Vanilla), HTML5, CSS3
* **Communication:** REST API Architecture with Modular Blueprints

## ⚙️ Installation

```bash
# Create virtual environment
py -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Upgrade pip and install requirements
py -m pip install --upgrade pip
pip install flask flask-sqlalchemy flask-cors python-dotenv