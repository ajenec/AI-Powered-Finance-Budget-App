import React, { useState } from "react";
import { Wallet, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 border-b border-white/10"
      style={{
        background: "rgba(42,53,68,0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "none",
      }}
    >
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 text-2xl">
            <span className="text-[#92C5E4]">
              <Wallet size={30} /> {/* bigger icon */}
            </span>
            <span className="text-white/90">
              Stack
              <span className="font-bold bg-gradient-to-r from-[#92C5E4] to-[#B8DCF0] bg-clip-text text-transparent">
                Wise
              </span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              <li>
                <a
                  href="#features"
                  className="text-white/80 hover:text-[#a6daf6] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#92C5E4] after:to-[#B8DCF0] hover:after:w-full after:transition-all after:duration-300"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-white/80 hover:text-[#a6daf6] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#92C5E4] after:to-[#B8DCF0] hover:after:w-full after:transition-all after:duration-300"
                >
                  How It Works
                </a>
              </li>
            </ul>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-white/90 hover:text-white px-4 py-2 rounded-md"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-[#8bc9ef] to-[#B8DCF0] hover:from-[#7bb5d4] hover:to-[#a3cce0] transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-white/90 hover:text-white"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4">
            <ul className="space-y-1 border-t border-white/10 pt-3">
              <li>
                <a
                  href="#features"
                  className="block rounded-md px-3 py-2 text-white/90 hover:bg-white/10"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="block rounded-md px-3 py-2 text-white/90 hover:bg-white/10"
                >
                  How It Works
                </a>
              </li>
            </ul>
            <div className="mt-3 flex items-center gap-2">
              <Link
                to="/login"
                className="flex-1 text-center rounded-md px-4 py-2 text-white/90 hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="flex-1 text-center rounded-md px-4 py-2 text-white bg-gradient-to-r from-[#92C5E4] to-[#B8DCF0]"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
