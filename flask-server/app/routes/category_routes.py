from flask import Blueprint, jsonify
from app.models import Category

category_bp = Blueprint('category', __name__)

@category_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all global categories (no authentication required for read-only access)"""
    try:
        categories = Category.get_all_categories()
        return jsonify([category.to_dict() for category in categories]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@category_bp.route('/categories/<string:type_of>', methods=['GET'])
def get_categories_by_type(type_of):
    """Get categories filtered by type (income or expense)"""
    try:
        if type_of not in ['income', 'expense']:
            return jsonify({'error': 'type_of must be either "income" or "expense"'}), 400
        
        categories = Category.get_categories_by_type(type_of)
        return jsonify([category.to_dict() for category in categories]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@category_bp.route('/categories/<int:category_id>', methods=['GET'])
def get_category(category_id):
    """Get a specific category by ID"""
    try:
        category = Category.get_category_by_id(category_id)
        if not category:
            return jsonify({'error': 'Category not found'}), 404
        return jsonify(category.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500