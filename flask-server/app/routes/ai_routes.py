from flask import Blueprint, request,jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from openai import OpenAI
from prophet import Prophet
import pandas as pd
import os
from app.models import db
from app.models import AiInsight, User, Expense
from datetime import datetime, timedelta

ai_bp = Blueprint('ai', __name__)


def get_openai_client():
    """Return an OpenAI client constructed from the OPENAI_API_KEY env var.
    Raise a RuntimeError if the key is not set so import-time failures are avoided.
    """
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise RuntimeError('OPENAI_API_KEY environment variable is not set')
    return OpenAI(api_key=api_key)

# Helper Functions
def get_user_expenses_last_30_days(user_id):
    """Retrieve user expenses for the last 30 days."""
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=30)
    expenses = (Expense.query.filter(
            Expense.user_id == user_id,
            Expense.date_spent >= start_date,
            Expense.date_spent <= end_date,
            Expense.deleted_at.is_(None)
        ).order_by(Expense.date_spent.asc()).all())
    return [{'date': e.date_spent, 'amount': e.amount} for e in expenses]


# Helper functions

@ai_bp.route('/ai', methods=['GET'])
@jwt_required()
def get_ai_insights():
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        insights = AiInsight.get_insights_by_user(user.id)
        return jsonify([insight.to_dict() for insight in insights]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_ai_insight():
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get last 30 days expenses
        expenses = get_user_expenses_last_30_days(user.id)
        if not expenses:
            return jsonify({'error': 'No expenses found for last 30 days'}), 404
        # Prepare data for Prophet
        df = pd.DataFrame(expenses)
        df.rename(columns={'date': 'ds', 'amount': 'y'}, inplace=True)

        # Forecast next 14 days using Prophet
        model = Prophet()
        model.fit(df)
        future = model.make_future_dataframe(periods=14)
        forecast = model.predict(future)
        predicted_next_14 = forecast.trail(14)['yhat'].sum()

        # spending stats
        total_spent = df['y'].sum()
        avg_daily_spent = df['y'].mean()
        percent_change = ((predicted_next_14 - total_spent) / total_spent) * 100 if total_spent != 0 else 0

        # Generate summary and advice using OpenAI
        ai_prompt = f""" 
        Analyze the user's 30-day spending data:
        - Total spent: ${total_spent:.2f}
        - Average daily spending: ${avg_daily_spent:.2f}
        - Next 14-day forecast: ${predicted_next_14:.2f}
        - Spending change projection: {percent_change:.2f}%

        Return the following in JSON format:    
        {{
        "summary_text": "A short friendly summary of their spending habits.",
        "savings_tip": "One actionable savings or budgeting tip.",
        "prediction": "A short forecast prediction (2 sentences)."
        }}
        """
        try:
            client = get_openai_client()
        except RuntimeError as re:
            # Return a clear HTTP error so the app doesn't crash at import
            return jsonify({'error': str(re), 'message': 'AI features are disabled on this server.'}), 503

        response = client.responses.create(
            model="gpt-5-mini",
            prompt=ai_prompt,
        )
        
        #Parse JSON from AI response
        import json
        try:
            ai_data = json.loads(response.output_text)
        except:
            ai_data = {
                "summary_text": response.output_text,
                "savings_tip": "Could not generate a savings tip properly.",
                "prediction": "Could not generate a prediction properly."
            } 

        ai_output = response.output_text.strip()

        # Create and save new AI Insight
        new_insight = AiInsight(
            user_id=user.id,
            title="Monthly Spending Summary",
            summary_text=ai_data.get("summary_text", ""),
            spending_pattern=f"Total: ${total_spent:.2f}, Avg Daily: ${avg_daily_spent:.2f}",
            savings_tip=ai_data.get("savings_tip", ""),
            prediction=ai_data.get("prediction", ""),
            )
        
        db.session.add(new_insight)
        db.session.commit()
        return jsonify(new_insight.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_bp.route('/ai/<int:insight_id>', methods=['DELETE'])
@jwt_required()
def delete_ai_insight(insight_id):
    try:
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        insight = AiInsight.query.filter_by(id=insight_id, user_id=user.id).first()
        if not insight:
            return jsonify({'error': 'Insight not found'}), 404
        AiInsight.delete_insight(insight.id)
        return jsonify({'message': 'Insight deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500