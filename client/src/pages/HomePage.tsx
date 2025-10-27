import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white text-center p-4">
      <h1 className="display-1 fw-bold">
        Welcome to the AI-Powered Finance Budget App!
      </h1>
      <p className="lead mt-3">
        Manage your finances with AI-powered insights!
      </p>
      <Link to="/login" className="btn btn-primary btn-lg mt-4">
        Login
      </Link>
      <Link to="/register" className="btn btn-secondary btn-lg mt-4">
        Sign up
      </Link>
    </div>
  );
};

export default HomePage;
