import React from "react";
import { Wallet, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Header: React.FC = () => {
  return (
    <header className="fixed-top border-bottom shadow-lg header-glass">
      <nav className="navbar navbar-expand-md navbar-dark py-3 container">
        {/* Logo Section */}
        <a
          href="#home"
          className="navbar-brand d-flex align-items-center gap-2 me-0"
        >
          <div className="logo-icon-wrapper">
            <Wallet size={22} className="logo-icon" />
          </div>
          <span className="brand-text">
            Stack<span className="brand-highlight">Wise</span>
          </span>
        </a>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0 shadow-none custom-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <Menu size={24} className="text-white" />
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-md-0">
            <li className="nav-item">
              <a
                href="#features"
                className="nav-link text-white nav-link-custom"
              >
                Features
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#how-it-works"
                className="nav-link text-white nav-link-custom"
              >
                How It Works
              </a>
            </li>
          </ul>

          {/* Auth Buttons */}
          <div className="d-flex gap-2 align-items-center">
            <Link to="/login" className="btn btn-sm px-4 py-2 btn-signin">
              Login
            </Link>
            <Link to="/register" className="btn btn-sm px-4 py-2 btn-signup">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
