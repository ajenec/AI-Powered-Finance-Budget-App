from . import db
from datetime import datetime

class Expense(db.Model):
    __tablename__ = 'expenses'

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey('users.id'), nullable=False)
    category_id = db.Column(db.BigInteger, db.ForeignKey('categories.id'), nullable=True)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    date_spent = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    deleted_at = db.Column(db.DateTime, nullable=True)

    user = db.relationship('User', backref=db.backref('expenses', lazy=True))
    category = db.relationship('Category', backref=db.backref('expenses', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'amount': self.amount,
            'description': self.description,
            'incurred_at': self.incurred_at.isoformat(),
            'created_at': self.created_at.isoformat()
        }
    
    def create_expense(data, user_id):
        pass  # Implement expense creation logic here

    def get_expenses_by_user(user_id):
        pass  # Implement logic to retrieve expenses for a specific user

    def update_expense(expense_id, data):
        pass  # Implement expense update logic here

    def delete_expense(expense_id):
        pass  # Implement expense deletion logic here

    # For AI insights 
    def total_expenses_by_period(user_id, start_date, end_date):
        pass  # Implement logic to calculate total expenses in a given period

    def get_expenses_by_category(user_id, category_id):
        pass  # Implement logic to retrieve expenses by category

    def average_spending_by_category(user_id):
        pass  # Implement logic to calculate average expense

    def get_recent_expenses(user_id, limit=5):
        pass  # Implement logic to retrieve recent expense entries

    def __repr__(self):
        return f'<Expense {self.amount} - {self.description}>'