import os
import requests

def send_sms(phone_number, message_text):
    api_key = os.getenv('TEXTBELT_API_KEY')
    payload = {'phone': phone_number, 'message': message_text, 'key': api_key}
    try:
        response = requests.post('https://textbelt.com/text', data=payload)
        return response.json()
    except Exception as e:
        return {"success": False, "error": str(e)}