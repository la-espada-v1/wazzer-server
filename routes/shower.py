from flask import Blueprint, request, jsonify
from models import Configuration
from gpiozero import PWMOutputDevice, DigitalOutputDevice
from utils import read_temp

shower_bp = Blueprint('shower', __name__)

ENHot = PWMOutputDevice(18)
IN1 = DigitalOutputDevice(23)
IN2 = DigitalOutputDevice(24)

ENCold = PWMOutputDevice(13)
IN3 = DigitalOutputDevice(27)
IN4 = DigitalOutputDevice(22)

IN1.on()
IN2.off()

IN3.on()
IN4.off()
CHANGE_TEMPERATURE_WITH=0.02

@shower_bp.route('/shower/start', methods=['POST'])
def shower_start():
    ENHot.value = 0.5
    ENCold.value = 0.5
    return jsonify({"status": "started"}), 200

@shower_bp.route('/shower/stop', methods=['POST'])
def shower_stop():
    ENHot.value = 0.0
    ENCold.value = 0.0
    return jsonify({"status": "stopped"}), 200

@shower_bp.route('/shower/bpm', methods=['POST'])
def shower_bpm():
    if ENHot.value == 0.0 and ENCold.value == 0.0:
        return jsonify({
            "status": "inactive",
            "message": "Shower is stopped."
        }), 200

    data = request.json
    bpm = data.get('bpm', 0)
    
    configs = {c.key: c.value for c in Configuration.query.all()}
    
    low_hr_limit = configs.get('lowHR')
    high_hr_limit = configs.get('highHR')

    if bpm > high_hr_limit:
        target_temperature = configs.get('highHRTemperature')
    elif bpm < low_hr_limit:
        target_temperature = configs.get('lowHRTemperature')
    else:
        target_temperature = configs.get('regularHRTemperature')

    current_temperature = read_temp()

    new_hot = ENHot.value
    new_cold = ENCold.value

    if current_temperature > target_temperature:
        # Too hot: Decrease Hot, Increase Cold
        new_hot -= CHANGE_TEMPERATURE_WITH
        new_cold += CHANGE_TEMPERATURE_WITH
    else:
        # Too cold: Increase Hot, Decrease Cold
        new_hot += CHANGE_TEMPERATURE_WITH
        new_cold -= CHANGE_TEMPERATURE_WITH

    # Clamp values
    ENHot.value = max(0.0, min(1.0, new_hot))
    ENCold.value = max(0.0, min(1.0, new_cold))

    metadata = {
        "status": "success",
        "action_taken": "temperature_adjusted",
        "metrics": {
            "current_bpm": bpm,
            "current_temperature": current_temperature
        },
        "hardware_state": {
            "hot_valve": ENHot.value,
            "cold_valve": ENCold.value
        }
    }

    print("Shower BPM metadata: ", metadata)

    return jsonify(metadata), 200
