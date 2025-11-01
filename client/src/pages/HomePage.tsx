import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HeroSection } from "../components/ui/Hero";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import {
  Brain,
  TrendingUp,
  Wallet,
  BarChart3,
  Target,
  Sparkles,
} from "lucide-react";

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Wallet,
      title: "Expense Tracking",
      description:
        "Easily add, edit, and delete income and expense items. Keep track of every dollar with intuitive tools.",
      color: "gradient-blue-cyan",
    },
    {
      icon: Target,
      title: "Budget Management",
      description:
        "Create and manage monthly or weekly budgets. Track your progress in real-time and stay on target.",
      color: "gradient-cyan-blue",
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description:
        "Get personalized recommendations that identify spending patterns and suggest areas for saving.",
      color: "gradient-purple-pink",
    },
    {
      icon: TrendingUp,
      title: "Goal Predictions",
      description:
        "AI predicts whether you'll meet your financial goals based on current spending habits.",
      color: "gradient-green-emerald",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Visualize spending trends with interactive charts and gain deeper insights into your finances.",
      color: "gradient-indigo-blue",
    },
    {
      icon: Sparkles,
      title: "Smart Saving Tips",
      description:
        "Receive AI-generated suggestions for saving opportunities tailored to your spending behavior.",
      color: "gradient-orange-yellow",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description:
        "Sign up for free with secure authentication. Your data is protected with bank-level encryption.",
    },
    {
      number: "02",
      title: "Track Income & Expenses",
      description:
        "Add your income sources and expenses. Set up budgets for different categories to stay organized.",
    },
    {
      number: "03",
      title: "Get AI Insights",
      description:
        "Our AI analyzes your spending patterns and provides personalized recommendations for saving.",
    },
    {
      number: "04",
      title: "Achieve Your Goals",
      description:
        "Monitor your progress with visual dashboards and let AI predict if you'll meet your financial targets.",
    },
  ];

  return (
    <div className="page-wrapper">
      <Header />
      <HeroSection />

      <section id="features" className="features-section">
        <div className="container">
          <h2 className="text-center mb-4">Features</h2>
          <p className="text-center mb-5">
            Track expenses, manage budgets, and get AI-powered insights.
          </p>

          <div className="row g-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 border-0 shadow-sm p-4">
                    <div
                      className={`feature-icon-wrapper ${feature.color} rounded-circle d-flex align-items-center justify-content-center text-white mb-3`}
                    >
                      <IconComponent size={32} />
                    </div>
                    <h5 className="card-title mb-3">{feature.title}</h5>
                    <p className="card-text text-muted mb-0">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <h2 className="text-center mb-4">How It Works</h2>
          <p className="text-center mb-5">
            Simple steps to take control of your finances.
          </p>

          <div className="steps-container d-flex flex-column gap-4">
            {steps.map((step, index) => (
              <div key={index} className="d-flex gap-4">
                <div className="flex-shrink-0">
                  <div className="step-number-circle rounded-circle d-flex align-items-center justify-content-center text-white fw-bold">
                    {step.number}
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h5 className="step-title mb-2">{step.title}</h5>
                  <p className="step-description mb-0">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
