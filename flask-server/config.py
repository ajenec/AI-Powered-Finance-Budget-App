import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

class Config:
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SECRET_KEY = os.getenv('SECRET_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')