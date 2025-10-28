import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavBar: React.FC = () => {
  const location = useLocation();
  const onProfilePage = location.pathname === "/profile";

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand fw-bold text-white" to="/dashboard">
          AI Finance
        </Link>

        <div>
          <Link
            to="/dashboard"
            className={`btn btn-sm mx-1 ${
              location.pathname === "/dashboard"
                ? "btn-light text-dark"
                : "btn-outline-light"
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/expenses"
            className={`btn btn-sm mx-1 ${
              location.pathname === "/expenses"
                ? "btn-light text-dark"
                : "btn-outline-light"
            }`}
          >
            Expenses
          </Link>

          <Link
            to="/income"
            className={`btn btn-sm mx-1 ${
              location.pathname === "/income"
                ? "btn-light text-dark"
                : "btn-outline-light"
            }`}
          >
            Income
          </Link>

          <Link
            to="/budgets"
            className={`btn btn-sm mx-1 ${
              location.pathname === "/budgets"
                ? "btn-light text-dark"
                : "btn-outline-light"
            }`}
          >
            Budgets
          </Link>

          {!onProfilePage && (
            <Link
              to="/profile"
              className={`btn btn-sm mx-1 ${
                location.pathname === "/profile"
                  ? "btn-light text-dark"
                  : "btn-outline-light"
              }`}
            >
              Profile
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
