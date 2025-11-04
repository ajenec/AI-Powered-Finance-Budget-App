import React from "react";
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

// 2A3544 - bg color blue gray
const HomePage: React.FC = () => {
  const features = [
    {
      icon: Wallet,
      title: "Expense Tracking",
      description:
        "Easily add, edit, and delete income and expense items. Keep track of every dollar with intuitive tools.",
      gradient: "gradient-blue-cyan",
    },
    {
      icon: Target,
      title: "Budget Management",
      description:
        "Create and manage monthly or weekly budgets. Track your progress in real-time and stay on target.",
      gradient: "gradient-cyan-blue",
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description:
        "Get personalized recommendations that identify spending patterns and suggest areas for saving.",
      gradient: "gradient-purple-pink",
    },
    {
      icon: TrendingUp,
      title: "Goal Predictions",
      description:
        "AI predicts whether you'll meet your financial goals based on current spending habits.",
      gradient: "gradient-green-emerald",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Visualize spending trends with interactive charts and gain deeper insights into your finances.",
      gradient: "gradient-indigo-blue",
    },
    {
      icon: Sparkles,
      title: "Smart Saving Tips",
      description:
        "Receive AI-generated suggestions for saving opportunities tailored to your spending behavior.",
      gradient: "gradient-orange-yellow",
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

  const getGradientClasses = (gradient: string) => {
    const gradients: Record<string, string> = {
      "gradient-blue-cyan": "from-blue-500 to-cyan-500",
      "gradient-cyan-blue": "from-cyan-500 to-blue-500",
      "gradient-purple-pink": "from-purple-500 to-pink-500",
      "gradient-green-emerald": "from-green-500 to-emerald-500",
      "gradient-indigo-blue": "from-indigo-500 to-blue-500",
      "gradient-orange-yellow": "from-orange-500 to-yellow-500",
    };
    return gradients[gradient] || "from-blue-500 to-purple-500";
  };

  return (
    <div>
      <Header />
      <HeroSection />

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Features
          </h2>
          <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Track expenses, manage budgets, and get AI-powered insights.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const gradientClass = getGradientClasses(feature.gradient);

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div
                    className={`w-16 h-16 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white mb-4`}
                  >
                    <IconComponent size={32} />
                  </div>
                  <h5 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h5>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Simple steps to take control of your finances.
          </p>

          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-6 mb-8 last:mb-0 bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-300"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-xl font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h5>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
