from . import db
from datetime import datetime

class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
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
        pass  # Implement category creation logic here

    def get_all_categories():
        pass  # Implement logic to retrieve all categories

    def get_category_by_name(name):
        pass  # Implement logic to retrieve category by name

    def update_category(category_id, data):
        pass  # Implement category update logic here

    def delete_category(category_id):
        pass  # Implement category deletion logic here

    def __repr__(self):
        return f'<Category {self.name}>'