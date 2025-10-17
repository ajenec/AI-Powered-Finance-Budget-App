from . import db
from datetime import datetime
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    
    def set_password(self, password):
        try:
            self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        except Exception as e:
            print(f"Error hashing password: {e}")
            raise # raise is used to propagate the exception after logging it


    def check_password(self, password):
        try:
            return bcrypt.check_password_hash(self.password_hash, password)
        except Exception as e:
            print(f"Error checking password: {e}")
            return False
        
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'username': self.username,
            'created_at': self.created_at.isoformat()
        }