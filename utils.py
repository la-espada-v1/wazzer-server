import os
import requests
import glob

def send_sms(phone_number, message_text):
    api_key = os.getenv('TEXTBELT_API_KEY')
    payload = {'phone': phone_number, 'message': message_text, 'key': api_key}
    try:
        response = requests.post('https://textbelt.com/text', data=payload)
        return response.json()
    except Exception as e:
        return {"success": False, "error": str(e)}

def read_temp():
    base_dir = '/sys/bus/w1/devices/'
    devices = glob.glob(base_dir + '28*')

    if not devices:
        raise RuntimeError("No DS18B20 sensor found!")

    device_folder = devices[0]

    device_file = device_folder + '/w1_slave'

    with open(device_file, 'r') as f:
        lines = f.readlines()

    # Optional safety check (VERY useful)
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        with open(device_file, 'r') as f:
            lines = f.readlines()

    temp_line = lines[1]
    temp_string = temp_line.split('t=')[1]
    temp_c = float(temp_string) / 1000.0

    return temp_c