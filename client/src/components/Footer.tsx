import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white py-3 mt-5">
      <div className="container text-center">
        <p className="mb-2">
          © 2024 AI-Powered Finance Budget App. All rights reserved.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <a
            href="https://docs.google.com/document/d/1HOhj8fM_9Ww-TwvVR8XpmEXX7NtHQmJ74rXF5tX36G4/edit?tab=t.0"
            className="text-decoration-none text-info"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
          <a
            href="https://github.com/ajenec"
            className="text-decoration-none text-info"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
