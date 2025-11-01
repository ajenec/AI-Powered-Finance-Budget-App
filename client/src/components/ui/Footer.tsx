import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      className="text-white py-4 shadow-sm mt-auto"
      style={{
        background: "linear-gradient(90deg, #4A90E2, #96CFF3)",
      }}
    >
      <div className="container text-center">
        <p className="mb-2 fw-light">
          © 2024 AI-Powered Finance Budget App. All rights reserved.
        </p>
        <div className="d-flex justify-content-center gap-4">
          <a
            href="https://docs.google.com/document/d/1HOhj8fM_9Ww-TwvVR8XpmEXX7NtHQmJ74rXF5tX36G4/edit?tab=t.0"
            className="text-white text-decoration-none fw-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
          <a
            href="https://github.com/ajenec"
            className="text-white text-decoration-none fw-semibold"
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
