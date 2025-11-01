# Migration to Global Static Categories

## Overview

This migration converts the categories system from per-user categories to global static categories that are shared across all users.

## Changes Made

### 1. Backend Model Changes

- **File**: `flask-server/app/models/categories.py`
- Removed `user_id` foreign key column
- Removed `is_default` column
- Made `name` unique globally
- Updated all methods to work with global categories
- Removed user-specific filtering

### 2. Database Migration

- **File**: `flask-server/migrations/versions/convert_categories_to_global.py`
- Drops `user_id` and `is_default` columns
- Adds unique constraint on category `name`
- Removes foreign key relationship to users table

### 3. API Routes Updates

- **File**: `flask-server/app/routes/category_routes.py`
- Removed authentication requirement (categories are now public/read-only)
- Removed POST, PUT, PATCH, DELETE endpoints
- Kept GET endpoints:
  - `GET /api/categories` - Get all categories
  - `GET /api/categories/<type>` - Get categories by type (income/expense)
  - `GET /api/categories/<id>` - Get specific category

### 4. Authentication Routes

- **File**: `flask-server/app/routes/auth_routes.py`
- Removed category seeding during user registration
- Removed Category import

### 5. Seed Script

- **File**: `flask-server/scripts/seed_global_categories.py`
- New script to populate database with comprehensive list of global categories
- Includes 40+ expense categories and 14+ income categories

### 6. Client-Side Updates

- **File**: `client/src/api/categoriesFetch.ts`
- Updated Category interface to remove `user_id` and `is_default`
- Made `type_of` required (not optional)
- Added `getCategoriesByType()` function
- Updated documentation

## Migration Steps

### Step 1: Backup Your Database

```bash
# If using PostgreSQL
pg_dump your_database > backup_before_category_migration.sql

# If using SQLite
cp instance/dev.db instance/dev.db.backup
```

### Step 2: Clean Up Duplicate Categories

**IMPORTANT**: Run this BEFORE the migration to consolidate duplicate category names.

```bash
cd flask-server
source venv/bin/activate  # Activate your virtual environment
python scripts/cleanup_duplicate_categories.py
```

This script will:

- Find all duplicate category names (case-insensitive)
- Keep one instance of each category
- Update all expenses, budgets, and incomes to reference the consolidated category
- Delete duplicate categories

### Step 3: Run the Migration

```bash
cd flask-server
flask db upgrade
```

### Step 3: Seed Global Categories

```bash
cd flask-server
python scripts/seed_global_categories.py
```

### Step 4: Verify the Migration

```bash
# Check categories table structure
flask shell
>>> from app.models import Category
>>> Category.query.count()  # Should show 50+ categories
>>> Category.query.filter_by(type_of='expense').count()
>>> Category.query.filter_by(type_of='income').count()
>>> exit()
```

### Step 6: Test the API

```bash
# Start the Flask server
python run.py

# In another terminal, test the endpoints
curl http://localhost:5000/api/categories
curl http://localhost:5000/api/categories/expense
curl http://localhost:5000/api/categories/income
```

### Step 7: Update and Test Client

```bash
cd client
npm install  # If needed
npm run dev

# Test category dropdown in expense/income/budget forms
# Verify categories load correctly
```

## Rollback Plan

If you need to rollback the migration:

```bash
cd flask-server
flask db downgrade
```

**Note**: This will add back the `user_id` and `is_default` columns, but you'll need to manually re-populate user-specific categories or restore from backup.

## Categories Included

### Expense Categories (40+)

- Food & Dining, Groceries, Restaurant & Takeout
- Bills & Utilities, Rent/Mortgage, Electricity, Water, Internet & Phone
- Transportation, Gas & Fuel, Public Transit, Car Maintenance
- Entertainment, Movies & Streaming, Hobbies
- Shopping, Clothing, Electronics, Home & Garden
- Health & Fitness, Medical, Gym & Sports, Pharmacy
- Education, Tuition, Books & Supplies, Courses & Training
- Travel, Flights, Hotels, Vacation
- Insurance, Personal Care, Pet Care, Subscriptions
- Savings, Investments, Debt Payment
- Gifts & Donations, Miscellaneous

### Income Categories (14+)

- Salary, Wages, Bonus
- Freelance, Business Income
- Investment Returns, Dividends, Interest
- Rental Income, Gifts Received, Refunds
- Side Hustle, Tax Refund, Other Income

## Benefits of Global Categories

1. **Consistency**: All users see the same standardized categories
2. **Simplified**: No need to create/manage categories per user
3. **Easier Analytics**: Aggregate spending patterns across users with consistent categories
4. **Better AI Insights**: AI models can learn from aggregated data with consistent categorization
5. **Reduced Database Size**: One set of categories instead of duplicate sets per user
6. **Maintenance**: Easier to add new categories or update existing ones

## Breaking Changes

⚠️ **Important**: This is a breaking change. After migration:

- Users can no longer create custom categories
- Existing user-specific categories will be deleted
- All users will use the same global category list
- Forms that previously allowed category creation will need updates

## Testing Checklist

- [ ] Expense form loads categories correctly
- [ ] Income form loads categories correctly
- [ ] Budget form loads categories correctly
- [ ] Category filtering by type works
- [ ] Existing expenses/incomes/budgets still reference correct categories
- [ ] No authentication errors when fetching categories
- [ ] AI insights still work with new category structure

## Support

If you encounter issues during migration:

1. Check the Flask logs for errors
2. Verify database connection
3. Ensure all migrations have been applied: `flask db current`
4. Check that seed script completed successfully
5. Restore from backup if necessary
