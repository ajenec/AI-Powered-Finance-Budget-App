from . import db
from datetime import datetime

class Budget(db.Model):
    __tablename__ = 'budgets'

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey('users.id'), nullable=False)
    category_id = db.Column(db.BigInteger, db.ForeignKey('categories.id'), nullable=False)
    period_type = db.Column(db.String(50), nullable=False)  # e.g., 'monthly', 'yearly'
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    goal_amount = db.Column(db.Float, nullable=False)
    remaining_amount = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship('User', backref=db.backref('budgets', lazy=True))
    category = db.relationship('Category', backref=db.backref('budgets', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category_id': self.category_id,
            'period_type': self.period_type,
            'goal_amount': self.goal_amount,
            'remaining_amount': self.remaining_amount,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'created_at': self.created_at.isoformat()
        }
    
    def create_budget(data, user_id):
        try:
            new_budget = Budget(
                user_id=user_id,
                category_id=data['category_id'],
                period_type=data['period_type'],
                start_date=data['start_date'],
                end_date=data['end_date'],
                goal_amount=data['goal_amount'],
                remaining_amount=data.get('remaining_amount', data['goal_amount'])
            )
            db.session.add(new_budget)
            db.session.commit()
            return new_budget
        except Exception as e:
            db.session.rollback()
            raise e

    def get_budgets_by_user(user_id):
        return Budget.query.filter_by(user_id=user_id).order_by(Budget.start_date.desc()).all()

    def update_budget(budget_id, data):
        budget = Budget.query.filter_by(id=budget_id).first()
        if not budget:
            return None
        try:
            if 'category_id' in data:
                budget.category_id = data['category_id']
            if 'period_type' in data:
                budget.period_type = data['period_type']
            if 'start_date' in data:
                budget.start_date = data['start_date']
            if 'end_date' in data:
                budget.end_date = data['end_date']
            if 'goal_amount' in data:
                budget.goal_amount = data['goal_amount']
            if 'remaining_amount' in data:
                budget.remaining_amount = data['remaining_amount']
            db.session.commit()
            return budget
        except Exception as e:
            db.session.rollback()
            raise e

    def delete_budget(budget_id):
        budget = Budget.query.filter_by(id=budget_id).first()
        if not budget:
            return None
        try:
            db.session.delete(budget)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise e

    # For AI insights
    def get_budget_progress(user_id, budget_id):
        pass  # Implement logic to track budget progress

    def remaining_budget(user_id, budget_id):
        pass  # Implement logic to calculate remaining budget

    @staticmethod
    def recalc_remaining_for_user_category(user_id, category_id):
        """Recalculate remaining_amount for all budgets for a given user and category.
        remaining = goal - sum(expenses within [start_date, end_date])
        """
        # Local import to avoid circular dependency at module load time
        from .expenses import Expense

        budgets = Budget.query.filter_by(user_id=user_id, category_id=category_id).all()
        print(f"[RECALC] Found {len(budgets)} budgets for user {user_id}, category {category_id}")
        
        for b in budgets:
            print(f"[RECALC] BEFORE Budget {b.id}: goal_amount={b.goal_amount}, remaining_amount={b.remaining_amount}")
            
            # Sum expenses for same user, same category, and within budget window
            total_spent = (
                db.session.query(db.func.coalesce(db.func.sum(Expense.amount), 0.0))
                .filter(
                    Expense.user_id == user_id,
                    Expense.category_id == category_id,
                    Expense.deleted_at.is_(None),
                    Expense.date_spent >= b.start_date,
                    Expense.date_spent <= b.end_date,
                )
                .scalar()
            )
            total_spent_float = float(total_spent or 0.0)
            new_remaining = b.goal_amount - total_spent_float
            
            print(f"[RECALC] Calculation: {b.goal_amount} (goal) - {total_spent_float} (spent) = {new_remaining} (new remaining)")
            
            b.remaining_amount = new_remaining
            
            print(f"[RECALC] AFTER Budget {b.id}: goal_amount={b.goal_amount}, remaining_amount={b.remaining_amount}")
            print(f"[RECALC] Period: {b.start_date} to {b.end_date}")
        
        db.session.commit()
        print(f"[RECALC] Committed changes to database")


    def get_budget_summary(user_id, period_type):
        pass  # Implement logic to summarize budgets by period

    def is_budget_exceeded(user_id, budget_id):
        pass  # Implement logic to check if budget is exceeded



    def __repr__(self):
        return f'<Budget {self.goal_amount} for category {self.category_id}>'