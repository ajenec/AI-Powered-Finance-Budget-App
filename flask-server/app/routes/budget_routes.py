from flask import Blueprint, jsonify, request
from app.models import db, Budget

budget_bp = Blueprint('budget', __name__)

# TODO: Implement budget routes
@budget_bp.route('/', methods=['GET'])
def get_budgets():
    """Get all budgets for a user"""
    return jsonify({'message': 'Budget routes not implemented yet'}), 501

@budget_bp.route('/', methods=['POST'])
def create_budget():
    """Create a new budget"""
    return jsonify({'message': 'Budget routes not implemented yet'}), 501
