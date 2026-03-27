from flask import Blueprint, request, jsonify
from models import Contact
from utils import send_sms

notify_bp = Blueprint('notify', __name__)

@notify_bp.route('/notify', methods=['POST'])
def notify():
    data = request.json or {}
    msg = data.get('message', 'Emergency alert!')
    contacts = Contact.query.all()
    results = [send_sms(c.telephone, msg) for c in contacts]
    return jsonify({"status": "sent", "results": results}), 200