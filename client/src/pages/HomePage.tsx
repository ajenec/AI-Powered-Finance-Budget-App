import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white text-center p-4">
      <h1 className="display-1 fw-bold">
        Welcome to the AI-Powered Finance Budget App!
      </h1>
      <p className="lead mt-3">
        Manage your finances with AI-powered insights!
      </p>
      <button
        className="btn btn-primary btn-lg mt-4"
        onClick={() => (window.location.href = "/login")}
      >
        Login
      </button>
      <button
        className="btn btn-secondary btn-lg mt-4"
        onClick={() => (window.location.href = "/register")}
      >
        Sign up
      </button>
    </div>
  );
};

export default HomePage;
