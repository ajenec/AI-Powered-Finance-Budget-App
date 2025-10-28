import React from "react";
import { useState } from "react";
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
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          background: "linear-gradient(135deg, #4A90E2 0%, #96CFF3 100%)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="p-5 bg-light rounded-4 shadow-lg w-100"
          style={{ maxWidth: "400px" }}
        >
          <h2 className="text-center mb-4 fw-bold text-primary">Login</h2>
          {error && <div>{error}</div>}
          <div className="mb-3">
            <label htmlFor="email" className="fw-semibold">
              Email address
            </label>
            <input
              type="email"
              className="form-control form-control-lg"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="fw-semibold">
              Password
            </label>
            <input
              type="password"
              className="form-control form-control-lg"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 btn-lg mb-3">
            Login
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={() => navigate("/register")}
          >
            Need an account? Register
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
