import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Wallet } from "lucide-react";

const SideNav: React.FC = () => {
  const location = useLocation();

  const links = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/expenses", label: "Expenses" },
    { path: "/income", label: "Income" },
    { path: "/budgets", label: "Budgets" },
    { path: "/profile", label: "Profile" },
  ];

  return (
    <aside
      className="fixed top-0 left-0 bottom-0 w-64 px-5 py-6 border-r border-white/10"
      style={{
        background: "rgba(42, 53, 68, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-3 mb-8 text-2xl">
        <div className="text-[#92C5E4]">
          <Wallet size={24} />
        </div>
        <span className="text-white/90">
          Stack
          <span className="font-bold bg-gradient-to-r from-[#92C5E4] to-[#B8DCF0] bg-clip-text text-transparent">
            Wise
          </span>
        </span>
      </Link>

      {/* Nav links */}
      <ul className="flex flex-col gap-2">
        {links.map(({ path, label }) => (
          <li key={path}>
            <Link
              to={path}
              className={`block px-4 py-3 rounded-lg transition-all ${
                location.pathname === path
                  ? "bg-gradient-to-r from-[#92C5E4] to-[#B8DCF0] text-white font-semibold"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideNav;
