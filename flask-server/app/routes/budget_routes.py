from flask import Blueprint, jsonify, request
from app.models import Budget, User, Category
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

budget_bp = Blueprint('budget', __name__)

@budget_bp.route('/budgets', methods=['GET'])
@jwt_required()
def get_budgets():
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        budgets = Budget.get_budgets_by_user(user.id)
        return jsonify([b.to_dict() for b in budgets]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@budget_bp.route('/budgets', methods=['POST'])
@jwt_required()
def create_budget():
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        data = request.get_json()
        # If no JSON was provided, return a clear 400 with diagnostic info
        if data is None:
            # Log raw body for debugging (may be empty or malformed)
            raw = request.get_data(as_text=True)
            request.environ.get('wsgi.errors', None) and print(f"DEBUG: raw request body: {raw}")
            return jsonify({'error': 'Request body must be JSON and not empty'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    # Convert date strings to datetime if necessary
    try:
        if 'start_date' in data and isinstance(data['start_date'], str):
            data['start_date'] = datetime.fromisoformat(data['start_date'])
        if 'end_date' in data and isinstance(data['end_date'], str):
            data['end_date'] = datetime.fromisoformat(data['end_date'])
        # Validate category ownership if provided
        if data and data.get('category_id') is not None:
            cat = Category.query.filter_by(id=data.get('category_id'), user_id=user.id).first()
            if not cat:
                return jsonify({'error': 'Invalid category_id or not authorized'}), 400
        new_budget = Budget.create_budget(data, user.id)
        return jsonify(new_budget.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@budget_bp.route('/budgets/<int:budget_id>', methods=['PUT', 'PATCH'])
@jwt_required()
def update_budget(budget_id):
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        data = request.get_json()
        if data is None:
            raw = request.get_data(as_text=True)
            request.environ.get('wsgi.errors', None) and print(f"DEBUG: raw request body: {raw}")
            return jsonify({'error': 'Request body must be JSON and not empty'}), 400
        # Convert date strings if provided
        if 'start_date' in data and isinstance(data['start_date'], str):
            data['start_date'] = datetime.fromisoformat(data['start_date'])
        if 'end_date' in data and isinstance(data['end_date'], str):
            data['end_date'] = datetime.fromisoformat(data['end_date'])
        # Validate category ownership if provided
        if data and data.get('category_id') is not None:
            cat = Category.query.filter_by(id=data.get('category_id'), user_id=user.id).first()
            if not cat:
                return jsonify({'error': 'Invalid category_id or not authorized'}), 400

        # Ensure the budget belongs to the user before updating
        existing = Budget.query.filter_by(id=budget_id, user_id=user.id).first()
        if not existing:
            return jsonify({'error': 'Budget not found or not authorized'}), 404

        budget = Budget.update_budget(budget_id, data)
        if not budget:
            return jsonify({'error': 'Budget not found'}), 404
        return jsonify(budget.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@budget_bp.route('/budgets/<int:budget_id>', methods=['DELETE'])
@jwt_required()
def delete_budget(budget_id):
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        # Ensure the budget belongs to the user before deleting
        existing = Budget.query.filter_by(id=budget_id, user_id=user.id).first()
        if not existing:
            return jsonify({'error': 'Budget not found or not authorized'}), 404

        result = Budget.delete_budget(budget_id)
        if not result:
            return jsonify({'error': 'Budget not found'}), 404
        return jsonify({'message': 'Budget deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
