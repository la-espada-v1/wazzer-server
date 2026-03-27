from flask import Blueprint, request, jsonify
from models import db, Contact

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/contact', methods=['POST'])
def add_contact():
    data = request.json
    new = Contact(name=data['name'], telephone=data['telephone'])
    db.session.add(new)
    db.session.commit()
    return jsonify({"message": "Saved!", "id": new.id}), 201

@contact_bp.route('/contact', methods=['GET'])
def get_contacts():
    all_c = Contact.query.all()
    return jsonify([{"id": c.id, "name": c.name, "telephone": c.telephone} for c in all_c]), 200

@contact_bp.route('/contact/<int:id>', methods=['DELETE'])
def delete_contact(id):
    c = Contact.query.get(id)
    if not c: return jsonify({"message": "Not found"}), 404
    db.session.delete(c)
    db.session.commit()
    return jsonify({"message": "Deleted!"}), 200