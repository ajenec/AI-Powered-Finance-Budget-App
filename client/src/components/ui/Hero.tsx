import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection: React.FC = () => {
  return (
    <>
      <section
        id="home"
        className="relative overflow-hidden min-h-screen px-4"
        style={{
          background: "linear-gradient(135deg, #173753 0%, #122C34 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center py-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-4 rounded-full px-3 py-1 text-sm text-white bg-white/10 ring-1 ring-white/20">
            <Sparkles size={16} />
            <span>AI-Powered Financial Intelligence</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
            Empower Your Wallet.
            <br />
            <span className="bg-gradient-to-r from-[#92C5E4] to-[#B8DCF0] bg-clip-text text-transparent">
              Simplify Your Goals.
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
            Take control of your personal finances with{" "}
            <strong>StackWise</strong>. Track expenses, manage budgets, and get
            AI-powered insights that help you save more and stress less.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center rounded-md px-5 py-3 text-white bg-gradient-to-r from-[#8bc9ef] to-[#a7d7f0] hover:from-[#7bb5d4] hover:to-[#a3cce0] transition-colors"
            >
              Create Free Account
              <ArrowRight size={18} className="ml-2" />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center rounded-md px-5 py-3 text-slate-900 bg-white border border-white/20 hover:bg-slate-50"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
