from flask import Blueprint, request, jsonify
from models import db, Configuration

config_bp = Blueprint('configuration', __name__)

DEFAULT_SETTINGS = {
    "lowHR": 50.0,
    "highHR": 120.0,
    "lowHRTemperature": 34.0,
    "regular": 36.6,
    "high": 38.5
}


def seed_defaults():
    for key, value in DEFAULT_SETTINGS.items():

        exists = Configuration.query.filter_by(key=key).first()
        if not exists:
            new_config = Configuration(key=key, value=value)
            db.session.add(new_config)
            print(f"[*] Added default setting: {key} = {value}")
    
    db.session.commit()

@config_bp.route('/configuration', methods=['GET'])
def get_all_configs():
    all_items = Configuration.query.all()

    return jsonify({item.key: item.value for item in all_items}), 200

def update_or_create(key, value):
    if value is None: return
    item = Configuration.query.filter_by(key=key).first()
    if item:
        item.value = value
    else:
        db.session.add(Configuration(key=key, value=value))
    db.session.commit()

@config_bp.route('/configuration/hr', methods=['POST'])
def set_hr():
    data = request.json
    update_or_create('lowHR', data.get('lowHR'))
    update_or_create('highHR', data.get('highHR'))
    return jsonify({"status": "updated"}), 200

@config_bp.route('/configuration/temperature', methods=['POST'])
def set_temp():
    data = request.json
    update_or_create('lowHRTemperature', data.get('lowHRTemperature'))
    update_or_create('regular', data.get('regular'))
    update_or_create('high', data.get('high'))
    return jsonify({"status": "updated"}), 200
