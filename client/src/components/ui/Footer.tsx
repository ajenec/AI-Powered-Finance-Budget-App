import React from "react";
import { Wallet } from "lucide-react";
import { useLocation } from "react-router-dom";

const Footer: React.FC = () => {
  const location = useLocation();

  // Check if we're on a page with SideNav
  const hasSideNav = [
    "/dashboard",
    "/expenses",
    "/income",
    "/budgets",
    "/profile",
  ].includes(location.pathname);

  return (
    <footer
      className={`mt-auto flex flex-col items-center text-center py-4 border-t border-white/10 transition-all ${
        hasSideNav ? "ml-64" : ""
      }`}
      style={{
        background: "rgba(42, 53, 68, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="text-[#92C5E4]">
            <Wallet size={20} />
          </div>
          <span className="font-semibold text-lg text-white/90">
            Stack
            <span className="font-bold bg-gradient-to-r from-[#92C5E4] to-[#B8DCF0] bg-clip-text text-transparent">
              Wise
            </span>
          </span>
        </div>

        <span className="text-sm text-white/70">
          © 2024. All rights reserved.
        </span>

        <div className="flex gap-4 mt-1">
          <a
            href="https://docs.google.com/document/d/1HOhj8fM_9Ww-TwvVR8XpmEXX7NtHQmJ74rXF5tX36G4/edit?tab=t.0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors text-sm relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#92C5E4] after:to-[#B8DCF0] hover:after:w-full after:transition-all after:duration-300"
          >
            Resume
          </a>
          <a
            href="https://github.com/ajenec"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors text-sm relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#92C5E4] after:to-[#B8DCF0] hover:after:w-full after:transition-all after:duration-300"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
