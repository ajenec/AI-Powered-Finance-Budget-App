from . import db
from datetime import datetime

class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    type_of = db.Column(db.String(50), nullable=False)  # e.g., 'income' or 'expense'
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type_of': self.type_of,
            'created_at': self.created_at.isoformat()
        }
    
    def create_category(data):
        """Create a global category (admin use only)"""
        try:
            # Prevent duplicate category names (case-insensitive)
            existing = Category.query.filter(db.func.lower(Category.name) == data['name'].lower()).first()
            if existing:
                return existing

            new_category = Category(
                name=data['name'],
                type_of=data['type_of']
            )
            db.session.add(new_category)
            db.session.commit()
            return new_category
        except Exception as e:
            db.session.rollback()
            raise e

    def get_all_categories():
        """Get all global categories"""
        return Category.query.order_by(Category.type_of, Category.name).all()

    def get_categories_by_type(type_of):
        """Get categories by type (income or expense)"""
        return Category.query.filter_by(type_of=type_of).order_by(Category.name).all()

    def get_category_by_id(category_id):
        """Get a specific category by ID"""
        return Category.query.filter_by(id=category_id).first()

    def get_category_by_name(name):
        """Get a specific category by name"""
        return Category.query.filter_by(name=name).first()

    def __repr__(self):
        return f'<Category {self.name} ({self.type_of})>'