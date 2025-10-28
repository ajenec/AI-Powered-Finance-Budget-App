import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const HomePage: React.FC = () => {
  const gradientStyle = {
    background: "linear-gradient(135deg, #4A90E2 0%, #96CFF3 100%)",
    color: "#ffffff",
  };

  return (
    <>
      <div
        className="d-flex flex-column justify-content-center align-items-center vh-100 text-center p-4"
        style={gradientStyle}
      >
        <div className="bg-dark bg-opacity-50 rounded-4 p-5 shadow-lg backdrop-blur-sm">
          <h1 className="display-4 fw-bold mb-3 display-heading">
            Welcome to <span className="text-info">AI Finance</span>
          </h1>
          <p className="lead mb-4">
            Manage your finances with AI-powered insights!
          </p>
          <div className="d-flex flex-column gap-3 w-100">
            <Link
              to="/login"
              className="btn btn-light btn-lg fw-semibold shadow-sm w-100"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn btn-outline-light btn-lg fw-semibold shadow-sm w-100"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
