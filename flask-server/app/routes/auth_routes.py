from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from ..models import User, db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import re

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

# Helper functions for input validation
def validate_registration_data(data):
    required_fields = ['first_name', 'last_name', 'email', 'username', 'password']
    for field in required_fields:
        if field not in data or not data[field]:
            return False, f'Missing or empty field: {field}'
    return True, ''

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    if len(password) < 6:
        return False, "Password must be at least 6 characters long."
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter."
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter."
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one digit."
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must contain at least one special character."
    return True, ""


@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        valid, message = validate_registration_data(data)

        if not valid:
            return jsonify({'error': message}), 400
        
        # Validate email format
        if not validate_email(data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password strength
        valid_password, password_message = validate_password(data['password'])
        if not valid_password:
            return jsonify({'error': password_message}), 400
        
        existing_user = User.query.filter((User.username == data['username']) | (User.email == data['email'])).first()

        if existing_user:
            return jsonify({'error': 'Username or email already exists'}), 400
        
        # Create user and use model method for password hashing
        new_user = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            username=data['username']
        )
        new_user.set_password(data['password'])

        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        access_token = create_access_token(identity=user.username)

        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()

        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/profile', methods=['PATCH'])
@jwt_required()
def update_profile():
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json() or {}

        # Only allow certain fields to be updated
        allowed = {'first_name', 'last_name', 'username', 'email'}
        updates = {k: v for k, v in data.items() if k in allowed}

        # If username or email are changing, ensure uniqueness
        if 'username' in updates and updates['username'] != user.username:
            existing = User.query.filter_by(username=updates['username']).first()
            if existing:
                return jsonify({'error': 'Username already in use'}), 400

        if 'email' in updates and updates['email'] != user.email:
            existing = User.query.filter_by(email=updates['email']).first()
            if existing:
                return jsonify({'error': 'Email already in use'}), 400

        # Apply updates
        for k, v in updates.items():
            setattr(user, k, v)

        db.session.commit()

        return jsonify(user.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400