from . import db
from datetime import datetime

class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    type_of = db.Column(db.String(50), nullable=False)  # e.g., 'income' or 'expense'
    user_id = db.Column(db.BigInteger, db.ForeignKey('users.id'), nullable=False)
    is_default = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationship to user (categories are user-scoped)
    user = db.relationship('User', backref=db.backref('categories', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type_of': self.type_of,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat(),
            'is_default': bool(self.is_default)
        }
    
    def create_category(data, user_id):
        try:
            # Prevent duplicate category names per user (case-insensitive)
            existing = Category.query.filter(db.func.lower(Category.name) == data['name'].lower(), Category.user_id == user_id).first()
            if existing:
                return existing

            new_category = Category(
                name=data['name'],
                type_of=data['type_of'],
                user_id=user_id,
                is_default=data.get('is_default', False)
            )
            db.session.add(new_category)
            db.session.commit()
            return new_category
        except Exception as e:
            db.session.rollback()
            raise e

    def get_all_categories():
        return Category.query.order_by(Category.created_at.desc()).all()

    def get_categories_by_user(user_id):
        return Category.query.filter_by(user_id=user_id).order_by(Category.created_at.desc()).all()

    def get_category_by_name(name):
        return Category.query.filter_by(name=name).first()

    def update_category(category_id, data, user_id=None):
        category = Category.query.filter_by(id=category_id).first()
        if not category:
            return None
        # Ownership check if user_id provided
        if user_id is not None and category.user_id != user_id:
            return None
        try:
            if 'name' in data:
                category.name = data['name']
            if 'type_of' in data:
                category.type_of = data['type_of']
            db.session.commit()
            return category
        except Exception as e:
            db.session.rollback()
            raise e

    def delete_category(category_id, user_id=None):
        category = Category.query.filter_by(id=category_id).first()
        if not category:
            return None
        # Ownership check if user_id provided
        if user_id is not None and category.user_id != user_id:
            return None
        try:
            db.session.delete(category)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise e

    def __repr__(self):
        return f'<Category {self.name}>'