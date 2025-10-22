from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Category, User

category_bp = Blueprint('category', __name__)

@category_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        categories = Category.get_categories_by_user(user.id)
        return jsonify([category.to_dict() for category in categories]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@category_bp.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        data = request.get_json()
        # Basic validation
        if not data or 'name' not in data or 'type_of' not in data:
            return jsonify({'error': 'name and type_of are required'}), 400
            # Do not allow creating default categories via the public endpoint
            if data.get('is_default'):
                return jsonify({'error': 'Cannot create default categories via this endpoint'}), 403

            new_category = Category.create_category(data, user.id)
            return jsonify(new_category.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
@category_bp.route('/categories/<int:category_id>', methods=['PUT', 'PATCH'])
@jwt_required()
def update_category(category_id):
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No update data provided'}), 400
        # Prevent modifying default categories
        existing = Category.query.filter_by(id=category_id).first()
        if not existing or existing.user_id != user.id:
            return jsonify({'error': 'Category not found or not authorized'}), 404
        if existing.is_default:
            return jsonify({'error': 'Default categories cannot be modified'}), 403

        category = Category.update_category(category_id, data, user.id)
        if not category:
            return jsonify({'error': 'Category not found'}), 404
        return jsonify(category.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400 
    
@category_bp.route('/categories/<int:category_id>', methods=['DELETE'])
@jwt_required()
def delete_category(category_id):
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        existing = Category.query.filter_by(id=category_id).first()
        if not existing or existing.user_id != user.id:
            return jsonify({'error': 'Category not found or not authorized'}), 404
        if existing.is_default:
            return jsonify({'error': 'Default categories cannot be deleted'}), 403

        success = Category.delete_category(category_id, user.id)
        if not success:
            return jsonify({'error': 'Category not found'}), 404
        return jsonify({'message': 'Category deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500