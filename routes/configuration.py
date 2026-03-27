from flask import Blueprint, request, jsonify
from models import db, Configuration 

config_bp = Blueprint('configuration', __name__)


def update_or_create(key, value):
    if value is None: return
    
    existing_item = Configuration.query.filter_by(key=key).first()
    
    if existing_item:
        existing_item.value = value 
        print(f"DEBUG: Updated {key} to {value}")
    else:
        new_item = Configuration(key=key, value=value) 
        db.session.add(new_item)
        print(f"DEBUG: Created {key} with {value}")
    
    db.session.commit()

@config_bp.route('/configuration/hr', methods=['POST'])
def set_hr():
    data = request.json
    update_or_create('lowHR', data.get('lowHR'))
    update_or_create('highHR', data.get('highHR'))
    return jsonify({"status": "success", "message": "HR boundaries saved"}), 200

@config_bp.route('/configuration/temperature', methods=['POST'])
def set_temp():
    data = request.json
    update_or_create('lowHRTemperature', data.get('lowHRTemperature'))
    update_or_create('regular', data.get('regular'))
    update_or_create('high', data.get('high'))
    return jsonify({"status": "success", "message": "Temperature presets saved"}), 200