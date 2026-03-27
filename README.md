<p align="center">
  <img width=256px src="https://raw.githubusercontent.com/la-espada-v1/wazzer-watch/refs/heads/main/app/src/main/icon-playstore.png" />
  <h1 align="center">Wazzer</h1>
  <p align="center">
    A smart showerhead system that adjusts water temperature based on the heart rate of people with anemia.
  </p>
</p>

<p align="center">
    <a href="https://github.com/la-espada-v1/wazzer-server/fork">
        <img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?color=FAA533&style=flat-square" alt="Contributions welcome badge" />
    </a>

</p>

---

## 🚀 Overview
**Wazzer** е IoT решение, предназначено да предпазва потребители с анемия или сърдечно-съдови проблеми по време на къпане. Системата следи пулса в реално време и динамично променя температурата на водата, за да предотврати припадъци или топлинни шокове чрез автоматизирана логика за безопасност.

## 🛠️ Tech Stack
* **Backend:** Python / Flask
* **Database:** SQLite & SQLAlchemy
* **Frontend:** JavaScript (Vanilla), HTML5, CSS3
* **Communication:** REST API Architecture

## ⚙️ Installation

```bash
# Create virtual environment
py -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Upgrade pip and install requirements
py -m pip install --upgrade pip
pip install flask flask-sqlalchemy flask-cors python-dotenv