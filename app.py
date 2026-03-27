from flask import Flask
from flask_cors import CORS
from models import db
from dotenv import load_dotenv

# Внасяме Blueprints
from routes.ui import ui_bp
from routes.contact import contact_bp
from routes.notify import notify_bp
from routes.measure import measure_bp
from routes.configuration import config_bp # НОВО: Внасяме новия файл

load_dotenv()
app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///wazzer.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

app.register_blueprint(ui_bp)
app.register_blueprint(contact_bp)
app.register_blueprint(notify_bp)
app.register_blueprint(measure_bp)
app.register_blueprint(config_bp) 

with app.app_context():
    db.create_all() 

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)