import React, { useEffect, useState } from "react";
import SideNav from "../components/ui/SideNav";
import Footer from "../components/ui/Footer";
import { getExpenses } from "../api/expensesFetch";
import { getIncomes } from "../api/incomesFetch";
import { getBudgets } from "../api/budgetsFetch";
import type { Expense } from "../types/expense";
import type { Income } from "../types/income";
import type { Budget } from "../types/budget";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Calendar,
  Clock,
} from "lucide-react";

const currency = (value: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      try {
        setLoading(true);
        const [expensesData, incomesData, budgetsData] = await Promise.all([
          getExpenses(),
          getIncomes(),
          getBudgets(),
        ]);
        if (!mounted) return;
        console.log("[Dashboard] Loaded budgets:", budgetsData);
        setExpenses(expensesData || []);
        setIncomes(incomesData || []);
        setBudgets(budgetsData || []);
      } catch (err: any) {
        console.error("Error fetching dashboard data", err);
        if (mounted) setError(err?.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();

    // Reload when user returns to dashboard
    const handleFocus = () => {
      console.log("[Dashboard] Window focused, reloading data...");
      if (mounted) fetchAll();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      mounted = false;
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const totalIncomes = incomes.reduce((s, i) => s + Number(i.amount || 0), 0);
  const netBalance = totalIncomes - totalExpenses;

  const today = new Date();
  const currentBudget =
    budgets.find((b) => {
      try {
        const start = new Date(b.start_date);
        const end = new Date(b.end_date);
        return start <= today && today <= end;
      } catch {
        return false;
      }
    }) ||
    budgets[0] ||
    null;

  // Calculate budget progress
  const budgetProgress = currentBudget
    ? ((currentBudget.goal_amount - currentBudget.remaining_amount) /
        currentBudget.goal_amount) *
      100
    : 0;

  // Get recent activities (last 5)
  const recentExpenses = [...expenses]
    .sort(
      (a, b) =>
        new Date(b.date_spent).getTime() - new Date(a.date_spent).getTime()
    )
    .slice(0, 5);

  const recentIncomes = [...incomes]
    .sort(
      (a, b) =>
        new Date(b.received_at).getTime() - new Date(a.received_at).getTime()
    )
    .slice(0, 5);

  if (loading) {
    return (
      <>
        <SideNav />
        <div className="min-h-screen pl-72 pr-6 py-8 overflow-x-hidden">
          <div className="text-center py-12">Loading dashboard data...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SideNav />

      <div className="min-h-screen pl-72 pr-6 py-8 overflow-x-hidden">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p>Welcome back! Here's your financial overview</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300">
            {error}
          </div>
        )}

        {/* Top Stats Row - 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Income Card */}
          <div
            className="rounded-xl p-6 border border-white/10 shadow-lg"
            style={{
              background: "rgba(42, 53, 68, 0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white/70">
                Total Income
              </h3>
              <div className="p-2 rounded-lg bg-green-500/20">
                <TrendingUp size={20} className="text-green-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {currency(totalIncomes)}
            </p>
            <small className="text-white/50 text-xs">
              From all recorded incomes
            </small>
          </div>

          {/* Total Expenses Card */}
          <div
            className="rounded-xl p-6 border border-white/10 shadow-lg"
            style={{
              background: "rgba(42, 53, 68, 0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white/70">
                Total Expenses
              </h3>
              <div className="p-2 rounded-lg bg-red-500/20">
                <TrendingDown size={20} className="text-red-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {currency(totalExpenses)}
            </p>
            <small className="text-white/50 text-xs">
              From all recorded expenses
            </small>
          </div>

          {/* Net Balance Card */}
          <div
            className="rounded-xl p-6 border border-white/10 shadow-lg"
            style={{
              background: "rgba(42, 53, 68, 0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white/70">
                Net Balance
              </h3>
              <div
                className={`p-2 rounded-lg ${
                  netBalance >= 0 ? "bg-blue-500/20" : "bg-orange-500/20"
                }`}
              >
                <DollarSign
                  size={20}
                  className={
                    netBalance >= 0 ? "text-blue-400" : "text-orange-400"
                  }
                />
              </div>
            </div>
            <p
              className={`text-3xl font-bold mb-1 ${
                netBalance >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {currency(netBalance)}
            </p>
            <small className="text-white/50 text-xs">
              Income minus expenses
            </small>
          </div>

          {/* Budget Progress Card */}
          <div
            className="rounded-xl p-6 border border-white/10 shadow-lg"
            style={{
              background: "rgba(42, 53, 68, 0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white/70">
                Budget Progress
              </h3>
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Target size={20} className="text-purple-400" />
              </div>
            </div>
            {currentBudget ? (
              <>
                <p className="text-3xl font-bold text-white mb-2">
                  {Math.round(budgetProgress)}%
                </p>
                <div className="w-full bg-white/10 rounded-full h-2 mb-1">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      budgetProgress >= 100 ? "bg-red-500" : "bg-purple-500"
                    }`}
                    style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                  />
                </div>
                <small className="text-white/50 text-xs">
                  {currency(currentBudget.remaining_amount)} remaining
                </small>
              </>
            ) : (
              <p className="text-white/50 text-sm">No active budget</p>
            )}
          </div>
        </div>

        {/* Current Budget Period Section */}
        {currentBudget && (
          <div
            className="rounded-xl p-6 border border-white/10 shadow-lg mb-8"
            style={{
              background: "rgba(42, 53, 68, 0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              Current Budget Period
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 text-white/70 mb-2">
                  <Clock size={16} />
                  <span className="text-sm font-semibold">Period Type</span>
                </div>
                <p className="text-white capitalize text-lg">
                  {currentBudget.period_type}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-white/70 mb-2">
                  <Calendar size={16} />
                  <span className="text-sm font-semibold">Start Date</span>
                </div>
                <p className="text-white text-lg">
                  {new Date(currentBudget.start_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-white/70 mb-2">
                  <Calendar size={16} />
                  <span className="text-sm font-semibold">End Date</span>
                </div>
                <p className="text-white text-lg">
                  {new Date(currentBudget.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity Section - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Expenses */}
          <div
            className="rounded-xl p-6 border border-white/10 shadow-lg"
            style={{
              background: "rgba(42, 53, 68, 0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              Recent Expenses
            </h3>
            {recentExpenses.length === 0 ? (
              <p className="text-white/50 text-center py-8">
                No expenses recorded yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {expense.description || "Expense"}
                      </p>
                      <small className="text-white/50 text-xs">
                        {new Date(expense.date_spent).toLocaleDateString()}
                      </small>
                    </div>
                    <p className="text-red-400 font-semibold">
                      -{currency(expense.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Income */}
          <div
            className="rounded-xl p-6 border border-white/10 shadow-lg"
            style={{
              background: "rgba(42, 53, 68, 0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              Recent Income
            </h3>
            {recentIncomes.length === 0 ? (
              <p className="text-white/50 text-center py-8">
                No income recorded yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentIncomes.map((income) => (
                  <div
                    key={income.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">{income.source}</p>
                      <small className="text-white/50 text-xs">
                        {new Date(income.received_at).toLocaleDateString()}
                      </small>
                    </div>
                    <p className="text-green-400 font-semibold">
                      +{currency(income.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Dashboard;
