from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import datetime
import os          
import requests     
from dotenv import load_dotenv 

# Зареждаме ключа от .env файла
load_dotenv() 

app = Flask(__name__)
CORS(app) 

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///wazzer.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- ПОМОЩНА ФУНКЦИЯ ЗА SMS (Добави я тук) ---
def send_sms(phone_number, message_text):
    api_key = os.getenv('TEXTBELT_API_KEY')
    payload = {
        'phone': phone_number,
        'message': message_text,
        'key': api_key
    }
    response = requests.post('https://textbelt.com/text', data=payload)
    return response.json()

# Модел за таблицата с контакти 
class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    telephone = db.Column(db.String(20), nullable=False)

with app.app_context():
    db.create_all()

# Получаване на измервания от часовника
@app.route('/measures', methods=['POST'])
def receive_measures():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    bpm = data.get('bpm', 0)
    sound = data.get('soundVolume', 0)
    oxygen = data.get('bloodOxygen', 0)
    
    shower_status = "RUNNING"
    if bpm > 100:
        shower_status = "STOPPED_FOR_SAFETY"
        # АВТОМАТИЧЕН SMS ПРИ ВИСОК ПУЛС:
        first_contact = Contact.query.first()
        if first_contact:
            send_sms(first_contact.telephone, f"Emergency! High BPM: {bpm}")
    
    print(f"DEBUG: BPM: {bpm}, Sound: {sound}, Status: {shower_status}")
    
    return jsonify({
        "status": "success",
        "shower_action": shower_status,
        "timestamp": datetime.datetime.now().isoformat()
    }), 200

# Добавяне на нов контакт
@app.route('/contact', methods=['POST'])
def add_contact():
    data = request.json
    if not data or 'name' not in data or 'telephone' not in data:
        return jsonify({"error": "Missing name or telephone"}), 400
    
    new_contact = Contact(name=data['name'], telephone=data['telephone'])
    db.session.add(new_contact)
    db.session.commit()
    return jsonify({"message": f"Contact {data['name']} saved!"}), 201

# Вземане на всички хора
@app.route('/contact', methods=['GET'])
def get_contacts():
    contacts = Contact.query.all()
    output = [{"id": c.id, "name": c.name, "telephone": c.telephone} for c in contacts]
    return jsonify(output), 200

# Изтриване на човек
@app.route('/contact/<int:id>', methods=['DELETE'])
def delete_contact(id):
    contact_to_delete = Contact.query.get(id)
    if not contact_to_delete:
        return jsonify({"message": "Не е намерен!"}), 404
    db.session.delete(contact_to_delete)
    db.session.commit()
    return jsonify({"message": f"ID {id} изтрит!"}), 200

# Изпращане на известие (Ръчно)
@app.route('/notify', methods=['POST'])
def notify_emergency():
    data = request.json or {}
    message = data.get('message', 'Emergency alert from Wazzer system!')
    contacts = Contact.query.all()
    results = []
    
    for c in contacts:
        api_response = send_sms(c.telephone, message)
        results.append({
            "phone": c.telephone,
            "success": api_response.get('success'),
            "error": api_response.get('error')
        })
        break # Слагаме break, защото безплатният Textbelt позволява само 1 SMS

    return jsonify({"status": "notifications_processed", "details": results}), 200

if __name__ == '__main__':
    # ВАЖНО: Смени на 0.0.0.0, за да може колегата ти да те вижда!
    app.run(debug=True, host='0.0.0.0', port=5000)