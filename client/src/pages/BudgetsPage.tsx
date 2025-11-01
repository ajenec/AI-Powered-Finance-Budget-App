import React, { useEffect, useState } from "react";
import BudgetForm from "../components/budgetComp/BudgetForm";
import BudgetList from "../components/budgetComp/BudgetList";
import NavBar from "../components/ui/NavBar";
import Footer from "../components/ui/Footer";
import type { Budget, NewBudget } from "../types/budget";
import { getBudgets, createBudget, deleteBudget } from "../api/budgetsFetch";
import { getToken } from "../api/authFetch";

const BudgetsPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
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
    load();
  }, []);

  const handleCreate = async (payload: NewBudget | Partial<NewBudget>) => {
    try {
      // Ensure user is authenticated before attempting to create a budget
      const token = getToken();
      if (!token) {
        setError("You must be signed in to create a budget.");
        return;
      }

      // createBudget expects a full NewBudget; cast cautiously.
      const created = await createBudget(payload as NewBudget);
      setBudgets((b) => [created, ...b]);
    } catch (err: any) {
      // bubble up or set local error — for now set page-level error
      setError(err?.message || "Failed to create budget");
    }
  };

  const handleDeleteExpense = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this budget?"
    );
    if (!confirmDelete) return;

    try {
      await deleteBudget(id);
      setBudgets((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("failed to delete budget:", err);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container py-4">
        <h1>Budgets Page</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-4">
          <BudgetForm onSubmit={handleCreate} submitLabel="Create" />
        </div>

        {loading ? (
          <div>Loading budgets...</div>
        ) : (
          <BudgetList budgets={budgets} onDelete={handleDeleteExpense} />
        )}
      </div>
      <Footer />
    </>
  );
};

export default BudgetsPage;
