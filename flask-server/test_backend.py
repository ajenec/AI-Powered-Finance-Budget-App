#!/usr/bin/env python3
import urllib.request
import urllib.error
import json
import time
import uuid

BASE = 'http://127.0.0.1:5001/api'


def req(method, path, data=None, token=None):
    url = BASE + path
    body = None
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    if data is not None:
        body = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.getcode(), json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        try:
            body = e.read().decode('utf-8')
            return e.code, json.loads(body) if body else {'error': 'No body'}
        except Exception:
            return e.code, {'error': 'HTTP error with unreadable body'}
    except Exception as e:
        return None, {'error': str(e)}


# Wait for server to start
for i in range(20):
    code, body = req('GET', '/auth/profile')
    if code is None and 'Connection refused' in body.get('error', ''):
        print('Waiting for server to start...')
        time.sleep(0.5)
        continue
    # If we got an auth error (401/422) that's fine - server is up
    if code in (401, 422, 404, 400):
        print('Server is responding.')
        break
    if code is not None:
        print('Server responded with', code)
        break
    time.sleep(0.5)
else:
    print('Server did not start in time. Exiting.')
    exit(1)

# Test data
unique = uuid.uuid4().hex[:8]
email = f'test_{unique}@example.com'
username = f'user_{unique}'
password = 'Aa1!test'  # meets complexity requirements

print('\n1) Registering user...')
code, body = req('POST', '/auth/register', {
    'first_name': 'Test',
    'last_name': 'User',
    'email': email,
    'username': username,
    'password': password
})
print('->', code, body)
if code not in (200, 201):
    print('Registration failed, aborting tests.')
    exit(1)

print('\n2) Logging in...')
code, body = req('POST', '/auth/login', {'email': email, 'password': password})
print('->', code, body)
if code != 200:
    print('Login failed, aborting.')
    exit(1)

token = body.get('access_token')
if not token:
    print('No token returned, aborting.')
    exit(1)

print('\n3) Getting profile...')
code, body = req('GET', '/auth/profile', token=token)
print('->', code, body)

print('\n4) Listing categories (expect seeded defaults)...')
code, categories = req('GET', '/categories', token=token)
print('->', code, categories)
if code != 200 or not isinstance(categories, list):
    print('Failed to list categories, aborting.')
    exit(1)

# pick an expense category
expense_cat = None
for c in categories:
    if c.get('type_of') == 'expense':
        expense_cat = c
        break
if not expense_cat:
    print('No expense category found, aborting.')
    exit(1)

print('\n5) Creating a budget...')
from datetime import datetime, timedelta
start = datetime.utcnow().date().isoformat()
end = (datetime.utcnow().date() + timedelta(days=30)).isoformat()
code, created = req('POST', '/budgets', {
    'category_id': expense_cat['id'],
    'period_type': 'monthly',
    'start_date': start,
    'end_date': end,
    'goal_amount': 500.0
}, token=token)
print('->', code, created)
if code not in (200, 201):
    print('Budget creation failed, aborting.')
    exit(1)

budget_id = created.get('id')

print('\n6) Listing budgets...')
code, budgets = req('GET', '/budgets', token=token)
print('->', code, budgets)
if code != 200:
    print('Failed to list budgets, aborting.')
    exit(1)

print('\n7) Updating budget goal_amount...')
code, updated = req('PUT', f'/budgets/{budget_id}', {'goal_amount': 750.0}, token=token)
print('->', code, updated)

print('\n8) Deleting budget...')
code, deleted = req('DELETE', f'/budgets/{budget_id}', token=token)
print('->', code, deleted)

# Cleanup: delete the test user so runs are isolated
try:
    print('\n9) Cleaning up test user...')
    # We can hit the profile endpoint to get user id, then delete via DB route if available.
    # This project doesn't expose a public delete-user endpoint, so we'll use a lightweight
    # admin-style cleanup by hitting the DB through a simple endpoint-less approach: create
    # a small direct DB connection via a one-off script.
    # For simplicity and safety in this script, we'll attempt to remove the user via the
    # `/api/auth/profile` (read) to confirm identity, and then call an internal admin delete
    # if available. If no delete endpoint exists, inform the developer to remove the user
    # manually or run migrations to reset the DB for CI.
    # NOTE: In this codebase there is no public delete-user endpoint; so we will not attempt
    # to delete via HTTP to avoid accidental security issues. Instead, print instructions.
    code, profile = req('GET', '/auth/profile', token=token)
    print('-> profile check:', code, profile)
    if code == 200:
        print('Test user created with username:', profile.get('username'))
        print('To fully clean up this test user from the DB, run a manual DB delete or reset your test DB.')
    else:
        print('Could not fetch profile for cleanup. Server returned:', code)
except Exception as e:
    print('Cleanup encountered an error:', e)

print('\nBackend integration test finished.')
