import React, { useState } from "react";
import { login } from "../api/authFetch";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Redirect to profile after successful login so token is stored first
      navigate("/profile");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center min-vh-100 overflow-auto"
        style={{
          background: "linear-gradient(135deg, #2B6CB0 0%, #96CFF3 100%)",
          fontFamily: "'Manrope', sans-serif",
          padding: "2rem 0",
        }}
      >
        <form
          onSubmit={handleSubmit}
          autoComplete="on"
          className="p-4 shadow-lg rounded-5 w-100"
          style={{
            maxWidth: "420px",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <h2 className="text-center mb-4 fw-bold text-white">Login</h2>
          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="fw-semibold text-white">
              Email address
            </label>
            <input
              type="email"
              className="form-control form-control-lg"
              id="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="fw-semibold text-white">
              Password
            </label>
            <input
              type="password"
              className="form-control form-control-lg"
              id="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 rounded-pill mb-3"
          >
            Login
          </button>
          <button
            type="button"
            className="btn btn-outline-light w-100 rounded-pill"
            onClick={() => navigate("/register")}
          >
            Need an account? Register
          </button>
          <div>
            <button
              type="button"
              className="btn btn-link mt-3 text-white"
              onClick={() => navigate("/")}
            >
              ← Back to Home
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
