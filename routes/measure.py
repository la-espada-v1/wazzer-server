from flask import Blueprint, request, jsonify
import datetime

measure_bp = Blueprint('measure', __name__)

@measure_bp.route('/measures', methods=['POST'])
def measures():
    data = request.json
    bpm = data.get('bpm', 0)
    print(f"DEBUG: BPM {bpm}")
    return jsonify({"status": "ok", "time": datetime.datetime.now().isoformat()}), 200