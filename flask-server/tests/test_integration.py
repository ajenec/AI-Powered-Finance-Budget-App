 import os
import json
import uuid
from datetime import datetime, timedelta

import pytest

# Ensure test env before importing the app so Config picks up these values
os.environ.setdefault('OPENAI_API_KEY', 'test')
os.environ.setdefault('SECRET_KEY', 'test-secret')
os.environ.setdefault('JWT_SECRET_KEY', 'test-jwt')
# Use an in-memory sqlite DB for fast isolated tests
os.environ.setdefault('DATABASE_URL', 'sqlite:///:memory:')

from app import create_app
from app.models import db, User, Category


@pytest.fixture(scope='module')
def app():
    app = create_app()
    app.config.update({'TESTING': True})

    # Create tables
    with app.app_context():
        db.create_all()
    yield app

    # Teardown
    with app.app_context():
        db.session.remove()
        db.drop_all()


@pytest.fixture(scope='module')
def client(app):
    return app.test_client()


def register_user(client, username, email, password):
    return client.post('/api/auth/register', json={
        'first_name': 'Test',
        'last_name': 'User',
        'email': email,
        'username': username,
        'password': password,
    })


def login_user(client, email, password):
    return client.post('/api/auth/login', json={'email': email, 'password': password})


def auth_headers(token):
    return {'Authorization': f'Bearer {token}'}


def test_happy_path_and_cleanup(client, app):
    unique = uuid.uuid4().hex[:8]
    email = f'test_{unique}@example.com'
    username = f'user_{unique}'
    password = 'Aa1!test'

    # Register
    r = register_user(client, username, email, password)
    assert r.status_code == 201

    # Login
    r = login_user(client, email, password)
    assert r.status_code == 200
    body = r.get_json()
    token = body.get('access_token')
    assert token

    # Profile
    r = client.get('/api/auth/profile', headers=auth_headers(token))
    assert r.status_code == 200

    # Categories seeded on registration
    r = client.get('/api/categories', headers=auth_headers(token))
    assert r.status_code == 200
    categories = r.get_json()
    assert isinstance(categories, list)
    # pick an expense category
    expense_cat = next((c for c in categories if c.get('type_of') == 'expense'), None)
    assert expense_cat is not None

    # Create budget with valid category
    start = datetime.utcnow().date().isoformat()
    end = (datetime.utcnow().date() + timedelta(days=30)).isoformat()
    r = client.post('/api/budgets', json={
        'category_id': expense_cat['id'],
        'period_type': 'monthly',
        'start_date': start,
        'end_date': end,
        'goal_amount': 500.0,
    }, headers=auth_headers(token))
    assert r.status_code in (200, 201)
    budget = r.get_json()
    budget_id = budget.get('id')

    # List budgets
    r = client.get('/api/budgets', headers=auth_headers(token))
    assert r.status_code == 200

    # Update budget
    r = client.put(f'/api/budgets/{budget_id}', json={'goal_amount': 750.0}, headers=auth_headers(token))
    assert r.status_code == 200
    updated = r.get_json()
    assert updated.get('goal_amount') == 750.0

    # Delete budget
    r = client.delete(f'/api/budgets/{budget_id}', headers=auth_headers(token))
    assert r.status_code == 200

    # Cleanup: remove the created user directly via DB to keep runs isolated
    with app.app_context():
        user = User.query.filter_by(username=username).first()
        if user:
            db.session.delete(user)
            db.session.commit()


def test_negative_cases(client, app):
    # Setup a user to test negative flows
    unique = uuid.uuid4().hex[:8]
    email = f'neg_{unique}@example.com'
    username = f'neg_{unique}'
    password = 'Aa1!test'

    r = client.post('/api/auth/register', json={
        'first_name': 'Neg', 'last_name': 'Case', 'email': email, 'username': username, 'password': password
    })
    assert r.status_code == 201

    # invalid password login
    r = client.post('/api/auth/login', json={'email': email, 'password': 'wrongpass'})
    assert r.status_code == 401

    # unauthorized access (no token) to protected endpoint
    r = client.get('/api/categories')
    assert r.status_code in (401, 422)

    # login to get token
    r = client.post('/api/auth/login', json={'email': email, 'password': password})
    assert r.status_code == 200
    token = r.get_json().get('access_token')

    # invalid category_id when creating budget
    r = client.post('/api/budgets', json={
        'category_id': 99999, 'period_type': 'monthly', 'start_date': datetime.utcnow().date().isoformat(),
        'end_date': (datetime.utcnow().date() + timedelta(days=30)).isoformat(), 'goal_amount': 100.0
    }, headers=auth_headers(token))
    assert r.status_code == 400

    # Cleanup user
    with app.app_context():
        user = User.query.filter_by(username=username).first()
        if user:
            db.session.delete(user)
            db.session.commit()
