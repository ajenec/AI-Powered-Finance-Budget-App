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
        return False
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter."
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter."
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one digit."
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must contain at least one special character."
    return True


@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        valid, message = validate_registration_data(data)

        if not valid:
            return jsonify({'error': message}), 400
        
        existing_user = User.query.filter((User.username == data['username']) | (User.email == data['email'])).first()

        if existing_user:
            return jsonify({'error': 'Username or email already exists'}), 400
        
        hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        new_user = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            username=data['username'],
            password_hash=hashed_pw
        )

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
        if not user or not bcrypt.check_password_hash(user.password_hash, password):
            return jsonify({'access_token': access_token}), 200
        
        access_token = create_access_token(identity=user.username)

        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.bp.route('/profile', methods=['GET'])
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