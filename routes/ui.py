from flask import Blueprint, render_template

ui_bp = Blueprint('ui', __name__)

@ui_bp.route('/')
def home():
    """Serves the main frontend page (index.html)"""
    return render_template('index.html')