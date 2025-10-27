import React from "react";
import { Link } from "react-router-dom";

const NavBar: React.FC = () => {
  return (
    <div>
      <h1>Welcome</h1>
      <nav>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/expenses">Expenses</Link>
          </li>
          <li>
            <Link to="/income">Income</Link>
          </li>
          <li>
            <Link to="/budgets">Budgets</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
