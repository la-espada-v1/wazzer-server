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


if __name__ == '__main__':
    # Пускаме сървъра
    app.run(debug=True, port=5000)