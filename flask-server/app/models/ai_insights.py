from . import db
from datetime import datetime

class AiInsight(db.Model):
    __tablename__ = 'ai_insights'

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey('users.id'), nullable=False)

    # Core content
    title = db.Column(db.String(150), nullable=False)
    summary_text = db.Column(db.Text, nullable=False)
    spending_pattern = db.Column(db.Text, nullable=True)
    savings_tip = db.Column(db.Text, nullable=True)
    prediction = db.Column(db.Text, nullable=True)

    # Optional metadata
    period = db.Column(db.String(20), nullable=True, default="30d")  # e.g. "7d", "14d", "30d"
    total_income = db.Column(db.Float, nullable=True)
    total_expense = db.Column(db.Float, nullable=True)
    income_change_pct = db.Column(db.Float, nullable=True)
    expense_change_pct = db.Column(db.Float, nullable=True)

    generated_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship('User', backref=db.backref('ai_insights', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'summary_text': self.summary_text,
            'spending_pattern': self.spending_pattern,
            'savings_tip': self.savings_tip,
            'prediction': self.prediction,
            'period': self.period,
            'total_income': self.total_income,
            'total_expense': self.total_expense,
            'income_change_pct': self.income_change_pct,
            'expense_change_pct': self.expense_change_pct,
            'generated_at': self.generated_at.isoformat()
        }

    def create_insight(user_id, summary_text, spending_pattern, savings_tip, prediction):
        try: 
            new_insight = AiInsight(
                user_id=user_id,
                title="AI-Generated Financial Insight",
                summary_text=summary_text,
                spending_pattern=spending_pattern,
                savings_tip=savings_tip,
                prediction=prediction
            )
            db.session.add(new_insight)
            db.session.commit()
            return new_insight
        except Exception as e:
            db.session.rollback()
            raise e

    def get_insights_by_user(user_id):
        try:
            return AiInsight.query.filter_by(user_id=user_id).all()
        except Exception as e:
            db.session.rollback()
            raise e

    def delete_insight(insight_id, user_id):
        try:
            insight = AiInsight.query.filter_by(id=insight_id, user_id=user_id).first()
            if insight:
                db.session.delete(insight)
                db.session.commit()
                return True
            return False
        except Exception as e:
            db.session.rollback()
            raise e

    def __repr__(self):
        title_preview = (self.title[:40] + '...') if self.title and len(self.title) > 43 else (self.title or '')
        return f'<AiInsight "{title_preview}" for User {self.user_id}>'