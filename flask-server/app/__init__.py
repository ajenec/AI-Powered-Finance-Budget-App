from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
# from flask_migrate import Migrate
from .models import db
from .routes.auth_routes import auth_bp
from config import Config

# Initialize extensions
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    # Create database tables
    with app.app_context():
        db.create_all()

    return app