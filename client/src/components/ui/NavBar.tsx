import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavBar: React.FC = () => {
  const location = useLocation();
  const onProfilePage = location.pathname === "/profile";

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark px-4 shadow-sm"
      style={{
        background: "linear-gradient(90deg, #4A90E2, #96CFF3)",
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand fw-bold text-white fs-4" to="/">
          StackWise
        </Link>

        <div className="d-flex align-items-center">
          {[
            { path: "/dashboard", label: "Dashboard" },
            { path: "/expenses", label: "Expenses" },
            { path: "/income", label: "Income" },
            { path: "/budgets", label: "Budgets" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`btn btn-sm mx-1 ${
                location.pathname === path
                  ? "btn-light text-dark fw-semibold"
                  : "btn-outline-light"
              }`}
            >
              {label}
            </Link>
          ))}

          {!onProfilePage && (
            <Link
              to="/profile"
              className={`btn btn-sm mx-1 ${
                location.pathname === "/profile"
                  ? "btn-light text-dark fw-semibold"
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
