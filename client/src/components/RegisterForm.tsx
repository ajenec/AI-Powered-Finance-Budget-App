import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signup } from "../api/authFetch";
import "bootstrap/dist/css/bootstrap.min.css";

const RegisterForm: React.FC = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(firstname, lastname, username, email, password);
      // Redirect or update UI on successful registration
    } catch (err: any) {
      setError(err.message || "Registration failed");
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
          <h2 className="text-center mb-4 fw-bold text-primary">Register</h2>
          {error && <div>{error}</div>}
          <div className="mb-3">
            <label htmlFor="firstname" className="fw-semibold">
              First Name
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="lastname" className="fw-semibold">
              Last Name
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="fw-semibold">
              Username
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="fw-semibold">
              Email
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
          <button
            type="submit"
            onClick={() => navigate("/login")}
            className="btn btn-primary w-100 btn-lg mb-3"
          >
            Register
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
          </button>
        </form>
      </div>
    </>
  );
};

export default RegisterForm;
