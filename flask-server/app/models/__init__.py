from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .budgets import Budget
from .incomes import Income
from .expenses import Expense
from .categories import Category
from .ai_insights import AiInsight

__all__ = ['User', 'Budget', 'Income', 'Expense', 'Category', 'AiInsight']