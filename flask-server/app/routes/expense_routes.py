from flask import Blueprint, jsonify, request
from app.models import Expense, User, Category, Budget
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
        print(f"[EXPENSE CREATE] Received data: {data}")
        
        # Convert date string to datetime if necessary
        if data and 'date_spent' in data and isinstance(data['date_spent'], str):
            try:
                data['date_spent'] = datetime.fromisoformat(data['date_spent'])
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use ISO 8601.'}), 400

        # Validate category if provided
        if data and data.get('category_id') is not None:
            cat = Category.query.filter_by(id=data.get('category_id')).first()
            if not cat:
                return jsonify({'error': 'Invalid category_id'}), 400
            if cat.type_of != 'expense':
                return jsonify({'error': 'category_id must be an expense category'}), 400

        new_expense = Expense.create_expense(data, user.id)
        print(f"[EXPENSE CREATE] Created expense: id={new_expense.id}, amount={new_expense.amount}, category_id={new_expense.category_id}, date={new_expense.date_spent}")

        # Recalculate related budgets if categorized
        if new_expense.category_id:
            print(f"[EXPENSE CREATE] Calling recalc for user={user.id}, category={new_expense.category_id}")
            Budget.recalc_remaining_for_user_category(user.id, new_expense.category_id)
        else:
            print(f"[EXPENSE CREATE] No category_id, skipping budget recalc")

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
        # Convert date string if provided
        if data and 'date_spent' in data and isinstance(data['date_spent'], str):
            try:
                data['date_spent'] = datetime.fromisoformat(data['date_spent'])
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use ISO 8601.'}), 400

        # Validate category if provided
        if data and data.get('category_id') is not None:
            cat = Category.query.filter_by(id=data.get('category_id')).first()
            if not cat:
                return jsonify({'error': 'Invalid category_id'}), 400
            if cat.type_of != 'expense':
                return jsonify({'error': 'category_id must be an expense category'}), 400

        # Ensure the expense belongs to the user before updating
        existing = Expense.query.filter_by(id=expense_id, user_id=user.id, deleted_at=None).first()
        if not existing:
            return jsonify({'error': 'Expense not found or not authorized'}), 404

        # Keep track of previous category in case it changes
        prev_category_id = existing.category_id

        expense = Expense.update_expense(expense_id, data)
        if not expense:
            return jsonify({'error': 'Expense not found'}), 404
        # Recalc budgets for both previous and new categories if necessary
        if prev_category_id:
            Budget.recalc_remaining_for_user_category(user.id, prev_category_id)
        if expense.category_id and expense.category_id != prev_category_id:
            Budget.recalc_remaining_for_user_category(user.id, expense.category_id)
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

        category_id = existing.category_id
        success = Expense.delete_expense(expense_id)
        if not success:
            return jsonify({'error': 'Expense not found'}), 404
        # Recalc related budgets after deletion
        if category_id:
            Budget.recalc_remaining_for_user_category(user.id, category_id)
        return jsonify({'message': 'Expense deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500