"""
Script to seed global static categories.
Run this after migrating to the global categories system.

Usage:
    cd flask-server
    python scripts/seed_global_categories.py
"""
import os
import sys

# Ensure project root (flask-server/) is on sys.path so `import app` works
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.models import db, Category


def seed_global_categories(app):
    """Seed the database with predefined global categories"""
    
    global_categories = [
        # Expense Categories
        {'name': 'Groceries', 'type_of': 'expense'},
        {'name': 'Restaurant & Takeout', 'type_of': 'expense'},
        {'name': 'Bills & Utilities', 'type_of': 'expense'},
        {'name': 'Rent/Mortgage', 'type_of': 'expense'},
        {'name': 'Gas & Fuel', 'type_of': 'expense'},
        {'name': 'Public Transit', 'type_of': 'expense'},
        {'name': 'Car Maintenance', 'type_of': 'expense'},
        {'name': 'Entertainment', 'type_of': 'expense'},
        {'name': 'Hobbies', 'type_of': 'expense'},
        {'name': 'Shopping', 'type_of': 'expense'},
        {'name': 'Electronics', 'type_of': 'expense'},
        {'name': 'Home & Garden', 'type_of': 'expense'},
        {'name': 'Health & Fitness', 'type_of': 'expense'},
        {'name': 'Medical', 'type_of': 'expense'},
        {'name': 'Sports', 'type_of': 'expense'},
        {'name': 'Education', 'type_of': 'expense'},
        {'name': 'Travel', 'type_of': 'expense'},
        {'name': 'Hotels', 'type_of': 'expense'},
        {'name': 'Vacation', 'type_of': 'expense'},
        {'name': 'Insurance', 'type_of': 'expense'},
        {'name': 'Personal Care', 'type_of': 'expense'},
        {'name': 'Pet Care', 'type_of': 'expense'},
        {'name': 'Subscriptions', 'type_of': 'expense'},
        {'name': 'Savings', 'type_of': 'expense'},
        {'name': 'Investments', 'type_of': 'expense'},
        {'name': 'Debt Payment', 'type_of': 'expense'},
        {'name': 'Gifts & Donations', 'type_of': 'expense'},
        {'name': 'Miscellaneous', 'type_of': 'expense'},

        # Income Categories
        {'name': 'Salary', 'type_of': 'income'},
        {'name': 'Wages', 'type_of': 'income'},
        {'name': 'Bonus', 'type_of': 'income'},
        {'name': 'Freelance', 'type_of': 'income'},
        {'name': 'Business Income', 'type_of': 'income'},
        {'name': 'Investment Returns', 'type_of': 'income'},
        {'name': 'Dividends', 'type_of': 'income'},
        {'name': 'Interest', 'type_of': 'income'},
        {'name': 'Rental Income', 'type_of': 'income'},
        {'name': 'Gifts Received', 'type_of': 'income'},
        {'name': 'Refunds', 'type_of': 'income'},
        {'name': 'Side Hustle', 'type_of': 'income'},
        {'name': 'Tax Refund', 'type_of': 'income'},
        {'name': 'Other Income', 'type_of': 'income'},
    ]

    with app.app_context():
        print("Starting to seed global categories...")
        
        # Clear existing categories (optional - comment out if you want to keep existing)
        # Category.query.delete()
        # db.session.commit()
        # print("Cleared existing categories.")
        
        created_count = 0
        skipped_count = 0
        
        for cat_data in global_categories:
            try:
                existing = Category.query.filter(
                    db.func.lower(Category.name) == cat_data['name'].lower()
                ).first()
                
                if existing:
                    print(f" - Skipped: '{cat_data['name']}' (already exists)")
                    skipped_count += 1
                    continue
                
                category = Category.create_category(cat_data)
                print(f" + Created: '{category.name}' ({category.type_of})")
                created_count += 1
                
            except Exception as e:
                print(f" ! Error creating category '{cat_data['name']}': {e}")
        
        print(f"\n✅ Seeding complete!")
        print(f"   Created: {created_count} categories")
        print(f"   Skipped: {skipped_count} categories (already existed)")
        print(f"   Total categories in database: {Category.query.count()}")


if __name__ == '__main__':
    app = create_app()
    seed_global_categories(app)
