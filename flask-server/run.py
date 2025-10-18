from app import create_app

app = create_app()

if __name__ == '__main__':
    # -----------Debugging statements
    print("Starting Flask app...")
    print("Database URL:", app.config.get('SQLALCHEMY_DATABASE_URI'))
    # -----------Debugging statements
    
    app.run(debug=True, host='0.0.0.0', port=5001)
