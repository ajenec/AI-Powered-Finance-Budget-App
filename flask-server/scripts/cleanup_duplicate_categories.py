"""
Script to cleanup duplicate categories before migration to global system.
This script consolidates duplicate category names and updates all references.

Run this BEFORE running the migration:
    cd flask-server
    python scripts/cleanup_duplicate_categories.py
"""
import os
import sys

# Ensure project root (flask-server/) is on sys.path so `import app` works
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.models import db, Category, Expense, Budget, Income


def cleanup_duplicates(app):
    """
    Consolidate duplicate categories and update all foreign key references.
    Keep one category per unique name (case-insensitive) and update all expenses,
    budgets, and incomes to point to the consolidated category.
    """
    with app.app_context():
        print("🔍 Analyzing duplicate categories...")
        
        # Get all unique category names (case-insensitive)
        all_categories = Category.query.all()
        name_map = {}  # maps lowercase name -> list of category objects
        
        for cat in all_categories:
            name_lower = cat.name.lower()
            if name_lower not in name_map:
                name_map[name_lower] = []
            name_map[name_lower].append(cat)
        
        # Find duplicates
        duplicates = {name: cats for name, cats in name_map.items() if len(cats) > 1}
        
        if not duplicates:
            print("✅ No duplicate categories found!")
            return
        
        print(f"📋 Found {len(duplicates)} category names with duplicates:")
        for name, cats in duplicates.items():
            print(f"   - '{name}': {len(cats)} instances")
        
        print("\n🔧 Starting consolidation...")
        
        total_consolidated = 0
        total_updated_expenses = 0
        total_updated_budgets = 0
        total_updated_incomes = 0
        
        for name_lower, categories in duplicates.items():
            # Keep the first category, delete the rest
            keeper = categories[0]
            to_delete = categories[1:]
            
            print(f"\n📌 Consolidating '{keeper.name}' (keeping ID: {keeper.id}):")
            
            for dup_cat in to_delete:
                # Update all expenses pointing to this duplicate
                expenses = Expense.query.filter_by(category_id=dup_cat.id).all()
                for exp in expenses:
                    exp.category_id = keeper.id
                    total_updated_expenses += 1
                
                # Update all budgets pointing to this duplicate
                budgets = Budget.query.filter_by(category_id=dup_cat.id).all()
                for budget in budgets:
                    budget.category_id = keeper.id
                    total_updated_budgets += 1
                
                # Update all incomes pointing to this duplicate (if Income has category_id)
                try:
                    incomes = Income.query.filter_by(category_id=dup_cat.id).all()
                    for income in incomes:
                        income.category_id = keeper.id
                        total_updated_incomes += 1
                except Exception:
                    # Income might not have category_id field
                    pass
                
                print(f"   - Removing duplicate ID: {dup_cat.id}")
                db.session.delete(dup_cat)
                total_consolidated += 1
            
            db.session.commit()
            print(f"   ✅ Consolidated {len(to_delete)} duplicates for '{keeper.name}'")
        
        print(f"\n{'='*60}")
        print("✅ Cleanup Complete!")
        print(f"{'='*60}")
        print(f"Categories consolidated: {total_consolidated}")
        print(f"Expenses updated: {total_updated_expenses}")
        print(f"Budgets updated: {total_updated_budgets}")
        print(f"Incomes updated: {total_updated_incomes}")
        print(f"Remaining categories: {Category.query.count()}")
        print(f"\n✨ You can now run: flask db upgrade")


if __name__ == '__main__':
    app = create_app()
    cleanup_duplicates(app)
