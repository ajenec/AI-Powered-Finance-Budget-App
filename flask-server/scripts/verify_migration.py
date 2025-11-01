"""
Quick verification script to check the migration was successful.
Run this to verify the global categories system is working.
"""
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.models import Category

def verify_migration(app):
    with app.app_context():
        print("="*60)
        print("VERIFYING GLOBAL CATEGORIES MIGRATION")
        print("="*60)
        
        # Check total categories
        total = Category.query.count()
        print(f"\n✅ Total Categories: {total}")
        
        # Check expense categories
        expense_cats = Category.query.filter_by(type_of='expense').count()
        print(f"✅ Expense Categories: {expense_cats}")
        
        # Check income categories
        income_cats = Category.query.filter_by(type_of='income').count()
        print(f"✅ Income Categories: {income_cats}")
        
        # Check for uniqueness
        all_cats = Category.query.all()
        names = [c.name for c in all_cats]
        unique_names = set(names)
        
        if len(names) == len(unique_names):
            print(f"✅ All category names are unique")
        else:
            print(f"❌ WARNING: Found duplicate names!")
            duplicates = [name for name in names if names.count(name) > 1]
            print(f"   Duplicates: {set(duplicates)}")
        
        # Sample categories
        print("\n📋 Sample Categories:")
        print("\nExpense Categories (first 10):")
        for cat in Category.query.filter_by(type_of='expense').limit(10).all():
            print(f"   - {cat.id}: {cat.name}")
        
        print("\nIncome Categories (first 10):")
        for cat in Category.query.filter_by(type_of='income').limit(10).all():
            print(f"   - {cat.id}: {cat.name}")
        
        print("\n" + "="*60)
        print("✅ VERIFICATION COMPLETE!")
        print("="*60)

if __name__ == '__main__':
    app = create_app()
    verify_migration(app)
