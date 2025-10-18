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
        pass  # Implement budget creation logic here

    def get_budgets_by_user(user_id):
        pass  # Implement logic to retrieve budgets for a specific user

    def update_budget(budget_id, data):
        pass  # Implement budget update logic here

    def delete_budget(budget_id):
        pass  # Implement budget deletion logic here

    # For AI insights
    def get_budget_progress(user_id, budget_id):
        pass  # Implement logic to track budget progress

    def remaining_budget(user_id, budget_id):
        pass  # Implement logic to calculate remaining budget


    def get_budget_summary(user_id, period_type):
        pass  # Implement logic to summarize budgets by period

    def is_budget_exceeded(user_id, budget_id):
        pass  # Implement logic to check if budget is exceeded



    def __repr__(self):
        return f'<Budget {self.goal_amount} for category {self.category_id}>'