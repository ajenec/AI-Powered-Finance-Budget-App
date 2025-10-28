from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from .models import db
from .routes.auth_routes import auth_bp
from .routes.budget_routes import budget_bp
from .routes.category_routes import category_bp
from .routes.expense_routes import expense_bp
from .routes.income_routes import income_bp
from .routes.ai_routes import ai_bp
from config import Config

# Initialize extensions
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions with app
    db.init_app(app)
    Migrate(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app)

    # Error Handlers
    @app.errorhandler(404)
    def not_found_error(error):
        app.logger.warning(f"404 Not Found: {error}")
        return {"error": "Resource not found"}, 404

    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error(f"500 Internal Server Error: {error}")
        return {"error": "An internal error occurred. Please try again later."}, 500

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(budget_bp, url_prefix='/api')
    app.register_blueprint(category_bp, url_prefix='/api')
    app.register_blueprint(expense_bp, url_prefix='/api')
    app.register_blueprint(income_bp, url_prefix='/api')
    app.register_blueprint(ai_bp, url_prefix='/api')

    # Create database tables
    # with app.app_context():
    #     db.create_all()

    return app