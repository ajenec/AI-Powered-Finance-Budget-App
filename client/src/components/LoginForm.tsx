import React, { useState } from "react";
import { login } from "../api/authFetch";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      // Redirect to profile after successful login so token is stored first
      navigate("/profile");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#173753] to-[#122C34]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600 mb-6">Sign in to continue to StackWise</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="on" className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#92C5E4] focus:border-transparent outline-none transition-all"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#92C5E4] focus:border-transparent outline-none transition-all"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-[#92C5E4] to-[#B8DCF0] text-white font-semibold rounded-lg hover:from-[#7bb5d4] hover:to-[#a3cce0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <button
            type="button"
            className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => navigate("/register")}
          >
            Need an account? Register
          </button>

          <button
            type="button"
            className="w-full py-2 px-4 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
