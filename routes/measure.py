from flask import Blueprint, request, jsonify
from models import Configuration # НОВО: Вече четем от таблицата с настройки
import datetime

measure_bp = Blueprint('measure', __name__)

@measure_bp.route('/measures', methods=['POST'])
def measures():
    data = request.json
    bpm = data.get('bpm', 0)
    
    high_limit = Configuration.query.filter_by(key='highHR').first()
    
    if high_limit and bpm > high_limit.value:
        print(f"!!! ALERT: BPM {bpm} is above your limit of {high_limit.value} !!!")
    
    return jsonify({"status": "received", "current_bpm": bpm}), 200