from flask import Blueprint, jsonify, request
from app.models import Income, User, Category
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

income_bp = Blueprint('income', __name__)

@income_bp.route('/incomes', methods=['GET'])
@jwt_required()
def get_incomes():
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        incomes = Income.get_incomes_by_user(user.id)
        return jsonify([income.to_dict() for income in incomes]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@income_bp.route('/incomes', methods=['POST'])
@jwt_required()
def create_income():
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        # Convert date string(s) to datetime if necessary
        # Support clients sending either 'date' or 'received_at'
        if data:
            if 'date' in data and isinstance(data['date'], str):
                try:
                    data['received_at'] = datetime.fromisoformat(data['date'])
                except ValueError:
                    return jsonify({'error': 'Invalid date format. Use ISO 8601.'}), 400
            elif 'received_at' in data and isinstance(data['received_at'], str):
                try:
                    data['received_at'] = datetime.fromisoformat(data['received_at'])
                except ValueError:
                    return jsonify({'error': 'Invalid received_at format. Use ISO 8601.'}), 400

        # Validate category if provided
        if data and data.get('category_id') is not None:
            cat = Category.query.filter_by(id=data.get('category_id')).first()
            if not cat:
                return jsonify({'error': 'Invalid category_id'}), 400
            if cat.type_of != 'income':
                return jsonify({'error': 'category_id must be an income category'}), 400

        new_income = Income.create_income(data, user.id)
        return jsonify(new_income.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@income_bp.route('/incomes/<int:income_id>', methods=['PUT', 'PATCH'])
@jwt_required()
def update_income(income_id):
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        # Convert date string(s) if provided
        if data:
            if 'date' in data and isinstance(data['date'], str):
                try:
                    data['received_at'] = datetime.fromisoformat(data['date'])
                except ValueError:
                    return jsonify({'error': 'Invalid date format. Use ISO 8601.'}), 400
            elif 'received_at' in data and isinstance(data['received_at'], str):
                try:
                    data['received_at'] = datetime.fromisoformat(data['received_at'])
                except ValueError:
                    return jsonify({'error': 'Invalid received_at format. Use ISO 8601.'}), 400

        # Validate category if provided
        if data and data.get('category_id') is not None:
            cat = Category.query.filter_by(id=data.get('category_id')).first()
            if not cat:
                return jsonify({'error': 'Invalid category_id'}), 400
            if cat.type_of != 'income':
                return jsonify({'error': 'category_id must be an income category'}), 400
       
        # Ensure the income belongs to the user before updating
        existing = Income.query.filter_by(id=income_id, user_id=user.id, deleted_at=None).first()
        if not existing:
            return jsonify({'error': 'Income not found or not authorized'}), 404

        income = Income.update_income(income_id, data)
        if not income:
            return jsonify({'error': 'Income not found'}), 404

        return jsonify(income.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@income_bp.route('/incomes/<int:income_id>', methods=['DELETE'])
@jwt_required()
def delete_income(income_id):
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        # Ensure the income belongs to the user before deleting
        existing = Income.query.filter_by(id=income_id, user_id=user.id, deleted_at=None).first()
        if not existing:
            return jsonify({'error': 'Income not found or not authorized'}), 404

        success = Income.delete_income(income_id)
        if not success:
            return jsonify({'error': 'Income not found'}), 404

        return jsonify({'message': 'Income deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500