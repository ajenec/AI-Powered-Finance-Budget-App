from flask import Blueprint, jsonify, request
from app.models import Expense, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

expense_bp = Blueprint('expense', __name__)

@expense_bp.route('/expenses', methods=['GET'])
@jwt_required()
def get_expenses():
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        expenses = Expense.get_expenses_by_user(user.id)
        return jsonify([expense.to_dict() for expense in expenses]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@expense_bp.route('/expenses', methods=['POST'])
@jwt_required()
def create_expense():
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        # Convert date string to datetime if necessary and map to model field
        if data and 'date' in data and isinstance(data['date'], str):
            try:
                data['date_spent'] = datetime.fromisoformat(data['date'])
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use ISO 8601.'}), 400

        new_expense = Expense.create_expense(data, user.id)
        return jsonify(new_expense.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@expense_bp.route('/expenses/<int:expense_id>', methods=['PUT', 'PATCH'])
@jwt_required()
def update_expense(expense_id):
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        # Convert date string if provided and map to model field
        if data and 'date' in data and isinstance(data['date'], str):
            try:
                data['date_spent'] = datetime.fromisoformat(data['date'])
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use ISO 8601.'}), 400

        # Ensure the expense belongs to the user before updating
        existing = Expense.query.filter_by(id=expense_id, user_id=user.id, deleted_at=None).first()
        if not existing:
            return jsonify({'error': 'Expense not found or not authorized'}), 404

        expense = Expense.update_expense(expense_id, data)
        if not expense:
            return jsonify({'error': 'Expense not found'}), 404
        return jsonify(expense.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@expense_bp.route('/expenses/<int:expense_id>', methods=['DELETE'])
@jwt_required()
def delete_expense(expense_id):
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        # Ensure the expense belongs to the user before deleting
        existing = Expense.query.filter_by(id=expense_id, user_id=user.id, deleted_at=None).first()
        if not existing:
            return jsonify({'error': 'Expense not found or not authorized'}), 404

        success = Expense.delete_expense(expense_id)
        if not success:
            return jsonify({'error': 'Expense not found'}), 404
        return jsonify({'message': 'Expense deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500