import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection: React.FC = () => {
  return (
    <section className="hero-section py-5" id="home">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8 text-center">
            {/* Badge */}
            <div className="d-inline-flex align-items-center gap-2 px-4 py-2 mb-4 hero-badge">
              <Sparkles className="sparkle-icon" size={16} />
              <span className="badge-text">
                AI-Powered Financial Intelligence
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="hero-title mb-4">
              Empower Your Wallet.
              <br />
              <span className="hero-highlight">Simplify Your Goals.</span>
            </h1>

            {/* Description */}
            <p className="hero-description mx-auto mb-5">
              Take control of your personal finances with{" "}
              <strong>StackWise</strong>. Track expenses, manage budgets, and
              get AI-powered insights that help you save more and stress less.
            </p>

            {/* CTA Buttons */}
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Link to="/register" className="btn btn-lg hero-btn-primary">
                Create Free Account
                <ArrowRight size={18} className="ms-2" />
              </Link>
              <Link to="/login" className="btn btn-lg hero-btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
