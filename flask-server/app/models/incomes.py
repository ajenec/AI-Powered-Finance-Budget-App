from . import db
from datetime import datetime


class Income(db.Model):
    __tablename__ = 'incomes'

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey('users.id'), nullable=False)
    category_id = db.Column(db.BigInteger, db.ForeignKey('categories.id'), nullable=True)
    amount = db.Column(db.Float, nullable=False)
    source = db.Column(db.String(100), nullable=False)
    received_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    deleted_at = db.Column(db.DateTime, nullable=True)

    user = db.relationship('User', backref=db.backref('incomes', lazy=True))
    category = db.relationship('Category', backref=db.backref('incomes', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category_id': self.category_id,
            'amount': self.amount,
            'source': self.source,
            'received_at': self.received_at.isoformat(),
            'created_at': self.created_at.isoformat()
        }
    
    def create_income(data, user_id):
        try:
            new_income = Income(
                user_id=user_id,
                category_id=data.get('category_id'),
                amount=data['amount'],
                source=data['source'],
                received_at=data.get('received_at', datetime.utcnow())
            )
            db.session.add(new_income)
            db.session.commit()
            return new_income
        except Exception as e:
            db.session.rollback()
            raise e


    def get_incomes_by_user(user_id):
        return Income.query.filter_by(user_id=user_id, deleted_at=None).order_by(Income.received_at.desc()).all()

    def update_income(income_id, data):
        income = Income.query.filter_by(id=income_id, deleted_at=None).first()
        if not income:
            return None
        try:
            if 'category_id' in data:
                income.category_id = data['category_id']
            if 'amount' in data:
                income.amount = data['amount']
            if 'source' in data:
                income.source = data['source']
            if 'received_at' in data:
                income.received_at = data['received_at']
            db.session.commit()
            return income
        except Exception as e:
            db.session.rollback()
            raise e

    def delete_income(income_id):
        income = Income.query.filter_by(id=income_id, deleted_at=None).first()
        if not income:
            return None
        try:
            income.deleted_at = datetime.utcnow()
            db.session.commit()
            return income
        except Exception as e:
            db.session.rollback()
            raise e

    # For AI insights
    def total_income_by_period(user_id, start_date, end_date):
        pass  # Implement logic to calculate total income in a given period

    def get_recent_incomes(user_id, limit=5):
        pass  # Implement logic to retrieve recent income entries

    def average_income(user_id):
        pass  # Implement logic to calculate average income

    def __repr__(self):
        return f'<Income {self.amount} from {self.source}>'