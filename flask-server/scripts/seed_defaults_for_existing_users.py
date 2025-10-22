"""
Script to seed default categories for existing users.
Run manually from the repository root (inside a virtualenv) like:

DATABASE_URL=sqlite:///dev.db SECRET_KEY=... JWT_SECRET_KEY=... python3 flask-server/scripts/seed_defaults_for_existing_users.py

This script intentionally does not modify DB schema or run migrations. It only inserts default categories for users that do not already have categories.
"""
import os
import sys

# Ensure project root (flask-server/) is on sys.path so `import app` works
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.models import db, User, Category


def seed_defaults(app):
    default_categories = [
    # Expense Categories
    {'name': 'Food & Dining', 'type_of': 'expense', 'is_default': True},
    {'name': 'Bills & Utilities', 'type_of': 'expense', 'is_default': True},
    {'name': 'Transportation', 'type_of': 'expense', 'is_default': True},
    {'name': 'Entertainment', 'type_of': 'expense', 'is_default': True},
    {'name': 'Shopping', 'type_of': 'expense', 'is_default': True},
    {'name': 'Health & Fitness', 'type_of': 'expense', 'is_default': True},
    {'name': 'Education', 'type_of': 'expense', 'is_default': True},
    {'name': 'Travel', 'type_of': 'expense', 'is_default': True},
    {'name': 'Miscellaneous', 'type_of': 'expense', 'is_default': True},

    # Income Categories
    {'name': 'Salary', 'type_of': 'income', 'is_default': True},
    {'name': 'Freelance', 'type_of': 'income', 'is_default': True},
    {'name': 'Investments', 'type_of': 'income', 'is_default': True},
    {'name': 'Gifts', 'type_of': 'income', 'is_default': True},
    {'name': 'Other Income', 'type_of': 'income', 'is_default': True},
    ]

    with app.app_context():
        users = User.query.all()
        for user in users:
            print(f"Checking categories for user: {user.username}")
            for c in default_categories:
                try:
                    # Check case-insensitive presence of this default category for the user
                    exists = Category.query.filter(db.func.lower(Category.name) == c['name'].lower(), Category.user_id == user.id).first()
                    if exists:
                        print(f" - {c['name']} already present for {user.username}")
                        continue
                    print(f" - Creating default category {c['name']} for {user.username}")
                    Category.create_category(c, user.id)
                except Exception as e:
                    print(f"Failed to create category {c['name']} for {user.username}: {e}")


if __name__ == '__main__':
    # Expect env vars to be set by the user
    app = create_app()
    seed_defaults(app)
