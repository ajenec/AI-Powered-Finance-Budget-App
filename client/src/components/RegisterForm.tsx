import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/authFetch";
import "bootstrap/dist/css/bootstrap.min.css";

const RegisterForm: React.FC = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(firstname, lastname, username, email, password);
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <h2 className="text-center mb-4 fw-bold text-white">Register</h2>
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <div className="mb-3">
          <label htmlFor="firstname" className="fw-semibold text-white">
            First Name
          </label>
          <input
            type="text"
            className="form-control form-control-lg"
            id="firstname"
            name="firstname"
            autoComplete="given-name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lastname" className="fw-semibold text-white">
            Last Name
          </label>
          <input
            type="text"
            className="form-control form-control-lg"
            id="lastname"
            name="lastname"
            autoComplete="family-name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="fw-semibold text-white">
            Username
          </label>
          <input
            type="text"
            className="form-control form-control-lg"
            id="username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="fw-semibold text-white">
            Email
          </label>
          <input
            type="email"
            className="form-control form-control-lg"
            id="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="fw-semibold text-white">
            Password
          </label>
          <input
            type="password"
            className="form-control form-control-md"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg w-100 rounded-pill mb-3"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <button
          type="button"
          className="btn btn-outline-light w-100 rounded-pill"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </button>

        <button
          type="button"
          className="btn btn-link mt-3 text-white"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
