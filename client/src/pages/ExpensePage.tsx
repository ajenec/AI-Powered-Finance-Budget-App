import React, { useEffect } from "react";
import ExpenseForm from "../components/expensesComp/ExpenseForm";
import ExpenseList from "../components/expensesComp/ExpenseList";
import ExpensesChart from "../components/expensesComp/ExpensesChart";
import SideNav from "../components/ui/SideNav";
import Footer from "../components/ui/Footer";
import type { Expense, NewExpense } from "../types/expense";
import {
  createExpense,
  getExpenses,
  deleteExpense,
} from "../api/expensesFetch";
import { getToken } from "../api/authFetch";

const ExpensePage: React.FC = () => {
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadExpense = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExpenses();
      setExpenses(data || []);
    } catch (err: any) {
      console.error("Failed to load expenses:", err);
      setError(err?.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpense();

    // Refresh when window gains focus (like Budgets page)
    const handleFocus = () => loadExpense();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleDeleteExpense = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );
    if (!confirmDelete) return;

    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  // 🧮 Calculate total
  const totalExpenses = expenses
    .reduce((sum, exp) => sum + exp.amount, 0)
    .toFixed(2);

  return (
    <>
      <SideNav />
      <div className="min-h-screen pl-72 pr-6 py-8 overflow-x-hidden">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-1">Expenses</h1>
          <p>Track and analyze where your money goes</p>
        </div>

        {error && <div className="text-red-400 mb-4">{error}</div>}

        {/* ----------- TOP SECTION: Total + Form | Chart ----------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Side: Total + Chart (mirror Budgets layout) */}
          <div className="flex flex-col gap-6">
            {/* Total Spent */}
            <div
              className="space-y-2 rounded-xl p-6 border border-white/10 shadow-lg"
              style={{
                background: "rgba(42, 53, 68, 0.7)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <h2 className="text-xl text-center font-semibold mb-3 text-white">
                Total Spent
              </h2>
              <p className="text-white/90 text-center">${totalExpenses}</p>
            </div>

            {/* Pie Chart under Total Overview */}
            <div className="w-full flex justify-center">
              <ExpensesChart expenses={expenses} />
            </div>
          </div>

          {/* Right Side: Form to match Budgets layout */}
          <div className="flex justify-center items-start">
            <div className="w-full max-w-md">
              <ExpenseForm
                onSubmit={async (payload) => {
                  try {
                    const token = getToken();
                    if (!token) {
                      setError("You must be signed in to create an expense.");
                      return;
                    }
                    await createExpense(payload as NewExpense);
                    await loadExpense();
                  } catch (err: any) {
                    console.error("Failed to create expense:", err);
                    setError(err?.message || "Failed to create expense");
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* ----------- BOTTOM SECTION: Expense List ----------- */}
        {loading ? (
          <div>Loading expenses...</div>
        ) : (
          <>
            <div className="flex flex-col gap-8">
              <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ExpensePage;
