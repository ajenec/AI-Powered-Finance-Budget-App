from . import db
from datetime import datetime

class Expense(db.Model):
    __tablename__ = 'expenses'

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    date_spent = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    deleted_at = db.Column(db.DateTime, nullable=True)

    user = db.relationship('User', backref=db.backref('expenses', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'amount': self.amount,
            'description': self.description,
            'date_spent': self.date_spent.isoformat(),
            'created_at': self.created_at.isoformat()
        }
    
    def create_expense(data, user_id):
        try:
            new_expense = Expense(
                user_id=user_id,
                amount=data['amount'],
                description=data.get('description'),
                date_spent=data.get('date_spent', datetime.utcnow())
            )
            db.session.add(new_expense)
            db.session.commit()
            return new_expense
        except Exception as e:
            db.session.rollback()
            raise e

    def get_expenses_by_user(user_id):
        return Expense.query.filter_by(user_id=user_id, deleted_at=None).order_by(Expense.date_spent.desc()).all()

    def update_expense(expense_id, data):
        expense = Expense.query.filter_by(id=expense_id, deleted_at=None).first()
        if not expense:
            return None
        try:
            if 'amount' in data:
                expense.amount = data['amount']
            if 'description' in data:
                expense.description = data['description']
            if 'date_spent' in data:
                expense.date_spent = data['date_spent']
            db.session.commit()
            return expense
        except Exception as e:
            db.session.rollback()
            raise e

    def delete_expense(expense_id):
        expense = Expense.query.filter_by(id=expense_id, deleted_at=None).first()
        if not expense:
            return None
        try:
            expense.deleted_at = datetime.utcnow()
            db.session.commit()
            return expense
        except Exception as e:
            db.session.rollback()
            raise e

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