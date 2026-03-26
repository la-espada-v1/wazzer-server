from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app) 


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///wazzer.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Модел за таблицата с контакти 
class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    telephone = db.Column(db.String(20), nullable=False)

# Създаване на базата данни в началото
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
    
    print(f"DEBUG: BPM: {bpm}, Sound: {sound}, Status: {shower_status}")
    
    return jsonify({
        "status": "success",
        "shower_action": shower_status,
        "timestamp": datetime.datetime.now().isoformat()
    }), 200

# Добавяне на нов контакт в SQLite
@app.route('/contact', methods=['POST'])
def add_contact():
    data = request.json
    if not data or 'name' not in data or 'telephone' not in data:
        return jsonify({"error": "Missing name or telephone"}), 400
    
    new_contact = Contact(name=data['name'], telephone=data['telephone'])
    db.session.add(new_contact)
    db.session.commit()
    
    return jsonify({"message": f"Contact {data['name']} saved to SQLite!"}), 201

# Вземане на всички хора (за да ги видиш в списък)
@app.route('/contact', methods=['GET'])
def get_contacts():
    contacts = Contact.query.all()
    output = []
    for c in contacts:
        output.append({"id": c.id, "name": c.name, "telephone": c.telephone})
    return jsonify(output), 200

# Изтриване на човек по неговото ID
@app.route('/contact/<int:id>', methods=['DELETE'])
def delete_contact(id):
    contact_to_delete = Contact.query.get(id)
    if not contact_to_delete:
        return jsonify({"message": "Човекът не е намерен!"}), 404
    
    db.session.delete(contact_to_delete)
    db.session.commit()
    return jsonify({"message": f"Контактът с ID {id} беше изтрит успешно!"}), 200

# Изчистване на ЦЕЛИЯ списък (ако искаш да почнеш на чисто)
@app.route('/contact/clear', methods=['DELETE'])
def clear_all_contacts():
    try:
        Contact.query.delete()
        db.session.commit()
        return jsonify({"message": "Всички контакти са изтрити!"}), 200
    except:
        db.session.rollback()
        return jsonify({"message": "Грешка при триенето!"}), 500

if __name__ == '__main__':
    # Пускаме сървъра
    app.run(debug=True, port=5000)