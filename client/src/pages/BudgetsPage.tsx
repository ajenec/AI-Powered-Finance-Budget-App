import React, { useEffect, useState } from "react";
import BudgetForm from "../components/budgetComp/BudgetForm";
import BudgetList from "../components/budgetComp/BudgetList";
import BudgetCharts from "../components/budgetComp/BudgetBarChart";
import BudgetPieChart from "../components/budgetComp/BudgetPieChart";
import SideNav from "../components/ui/SideNav";
import Footer from "../components/ui/Footer";
import type { Budget, NewBudget } from "../types/budget";
import { getBudgets, createBudget, deleteBudget } from "../api/budgetsFetch";
import { getToken } from "../api/authFetch";

const BudgetsPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBudgets = async () => {
    setLoading(true);
    try {
      const data = await getBudgets();
      setBudgets(data || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();

    const handleFocus = () => loadBudgets();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleCreate = async (payload: NewBudget | Partial<NewBudget>) => {
    try {
      const token = getToken();
      if (!token) {
        setError("You must be signed in to create a budget.");
        return;
      }

      const created = await createBudget(payload as NewBudget);
      setBudgets((b) => [created, ...b]);
    } catch (err: any) {
      setError(err?.message || "Failed to create budget");
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;

    try {
      await deleteBudget(id);
      setBudgets((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("failed to delete budget:", err);
    }
  };

  // Calculate total spent and total goal
  const totalGoal = budgets.reduce((sum, b) => sum + b.goal_amount, 0);
  const totalRemaining = budgets.reduce(
    (sum, b) => sum + b.remaining_amount,
    0
  );
  const totalSpent = totalGoal - totalRemaining;
  const progress = totalGoal ? (totalSpent / totalGoal) * 100 : 0;

  return (
    <>
      <SideNav />
      <div className="min-h-screen pl-72 pr-6 py-8 overflow-x-hidden">
        {/* Page Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-1">Budgets</h1>
          <p>Plan, track, and achieve your financial goals</p>
        </div>

        {error && <div className="text-red-400 mb-4">{error}</div>}

        {/* ---------- TOP SECTION: Overview + Chart + Form ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* LEFT SIDE: Overview + Pie Chart */}
          <div className="flex flex-col gap-6">
            <div
              className="space-y-2 rounded-xl p-6 border border-white/10 shadow-lg"
              style={{
                background: "rgba(42, 53, 68, 0.7)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <h2 className="text-xl font-semibold mb-3 text-white">
                Total Overview
              </h2>
              <div className="space-y-2 text-white/90">
                <p>
                  <strong>Total Budgeted:</strong> ${totalGoal.toFixed(2)}
                </p>
                <p>
                  <strong>Total Spent:</strong> ${totalSpent.toFixed(2)}
                </p>
                <p>
                  <strong>Remaining:</strong> ${totalRemaining.toFixed(2)}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-3 mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    progress >= 100 ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <small className="block mt-1 text-white/70">
                {Math.round(progress)}% of total budget used
              </small>
            </div>

            {/* Pie Chart below Overview */}
            <div className="w-full flex justify-center">
              <BudgetPieChart budgets={budgets} />
            </div>
          </div>

          {/* RIGHT SIDE: Form */}
          <div className="flex justify-center items-start">
            <div className="w-full max-w-md">
              <BudgetForm onSubmit={handleCreate} submitLabel="Create Budget" />
            </div>
          </div>
        </div>

        {/* ---------- BOTTOM SECTION: Table + Bar Chart ---------- */}
        <div className="flex flex-col gap-8">
          <BudgetCharts budgets={budgets} />
          {loading ? (
            <div>Loading budgets...</div>
          ) : (
            <BudgetList budgets={budgets} onDelete={handleDeleteExpense} />
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BudgetsPage;
