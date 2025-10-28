# AI-Powered-Finance-Budget-App

## Project Overview

This is a full-stack web application to help users track incomes, expenses, and budgets and to provide AI-powered insights and recommendations. The codebase demonstrates secure user authentication, relational data modeling, API design, and simple AI integration.

This README highlights how to run the backend, run the integration tests I added, and how CI is configured.

## Quickstart — Backend (flask-server)

Prerequisites

- Python 3.13 (the project was tested with 3.13; any Python 3.10+ should work but using the same version reduces surprises)
- PostgreSQL for development (the app uses DATABASE_URL), or you can run tests using SQLite in-memory

1. Create and activate a virtual environment (recommended):

```bash
python3.13 -m venv .venv
source .venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r flask-server/requirements.txt
pip install pytest
```

3. Configure environment variables (example):

```bash
export DATABASE_URL=postgresql://postgres:password@localhost:5432/finance_db
export SECRET_KEY=your-secret
export JWT_SECRET_KEY=your-jwt-secret
export OPENAI_API_KEY=your-openai-key  # optional for AI routes
```

4. Start the server (development):

```bash
python3.13 flask-server/run.py
```

The server listens by default on port 5001 (http://127.0.0.1:5001).

## Integration testing (local)

I added two ways to run integration checks:

- A small standalone script: `flask-server/test_backend.py` — quick HTTP-based happy-path test that registers a test user, logs in, exercises categories and budgets CRUD, then prints cleanup instructions.
- A pytest-based suite: `flask-server/tests/test_integration.py` — uses Flask's test client and an in-memory SQLite DB for fast, isolated tests. This is what CI runs.

Run pytest-based tests locally (recommended):

```bash
cd flask-server
python3.13 -m pytest -q tests
```

Run the quick HTTP script (requires server running):

```bash
python3.13 flask-server/test_backend.py
```

Notes about cleanup

- The pytest tests remove created test users via direct DB cleanup, keeping tests isolated.
- The `test_backend.py` script will create a test user and a budget and deletes the budget, but it does not delete the user via HTTP (no public delete-user endpoint). It prints instructions for manual DB cleanup; use the pytest suite for fully automated, isolated runs.

## Continuous Integration

A GitHub Actions workflow was added at `.github/workflows/integration-tests.yml`. It runs the pytest suite using an in-memory SQLite DB and sets minimal env variables. The workflow installs `flask-server/requirements.txt` and `pytest` before running tests.

If you want CI to run Postgres-backed tests (migrations + DB-specific behavior), add a job that starts the `postgres` service and runs migrations before the tests.

## Notes and next steps

- For local development prefer using a virtual environment to avoid polluting system Python packages.
- The AI routes require an OpenAI API key (or equivalent) and are safe to skip in tests by setting a dummy `OPENAI_API_KEY` environment variable.
