import React, { useEffect, useState } from "react";
import BudgetForm from "../components/budgetComp/BudgetForm";
import BudgetList from "../components/budgetComp/BudgetList";
import BudgetCharts from "../components/budgetComp/BudgetCharts";
import NavBar from "../components/ui/NavBar";
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
      <NavBar />
      <div className="container py-4">
        <h1 className="mb-4 fw-bold text-center">Budgets</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Two-column layout */}
        <div className="row g-4 align-items-start">
          {/* LEFT — Summary Box */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0 bg-light text-center p-4 h-100">
              <h4 className="fw-semibold mb-3">Total Overview</h4>
              <p className="mb-1">
                <strong>Total Budgeted:</strong> ${totalGoal.toFixed(2)}
              </p>
              <p className="mb-1">
                <strong>Total Spent:</strong> ${totalSpent.toFixed(2)}
              </p>
              <p className="mb-3">
                <strong>Remaining:</strong> ${totalRemaining.toFixed(2)}
              </p>

              <div className="progress" style={{ height: "12px" }}>
                <div
                  className={`progress-bar ${
                    progress >= 100 ? "bg-danger" : "bg-success"
                  }`}
                  role="progressbar"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <small className="text-muted">
                {Math.round(progress)}% of total budget used
              </small>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="col-md-6">
            <BudgetForm onSubmit={handleCreate} submitLabel="Create Budget" />
          </div>
        </div>

        {/* Chart Section */}
        <div className="mb-4">
          <BudgetCharts budgets={budgets} />
        </div>

        {/* Budget List */}
        <div className="mt-5">
          {loading ? (
            <div className="text-center text-muted py-4">
              Loading budgets...
            </div>
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
