import React, { useEffect } from "react";
import ExpenseForm from "../components/expensesComp/ExpenseForm";
import ExpenseList from "../components/expensesComp/ExpenseList";
import ExpensesChart from "../components/expensesComp/ExpensesChart";
import NavBar from "../components/ui/NavBar";
import Footer from "../components/ui/Footer";
import type { Expense, NewExpense } from "../types/expense";
import {
  createExpense,
  getExpenses,
  deleteExpense,
} from "../api/expensesFetch";

const ExpensePage: React.FC = () => {
  const [expenses, setExpenses] = React.useState<Expense[]>([]);

  const loadExpense = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      console.error("Failed to load expenses:", err);
    }
  };

  useEffect(() => {
    loadExpense();
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
      <NavBar />
      <div className="container my-5">
        <h1 className="text-center mb-4">Expense Tracker</h1>

        {/* ----------- TOP SECTION: Total + Form | Chart ----------- */}
        <div className="row g-4 mb-5">
          {/* Left Side: Total + Form */}
          <div className="col-md-6">
            {/* Total Spent */}
            <div className="card p-3 mb-4 shadow-sm">
              <h5 className="fw-bold text-center mb-2">Total Spent</h5>
              <p className="fs-3 text-center text-danger mb-0">
                ${totalExpenses}
              </p>
            </div>

            {/* Expense Form */}

            <ExpenseForm
              onSubmit={async (payload) => {
                try {
                  await createExpense(payload as NewExpense);
                  await loadExpense();
                } catch (err) {
                  console.error("Failed to create expense:", err);
                }
              }}
            />
          </div>

          {/* Right Side: Chart */}
          <div className="col-md-6">
            <ExpensesChart expenses={expenses} />
          </div>
        </div>

        {/* ----------- BOTTOM SECTION: Expense List ----------- */}
        <div className="card p-4 shadow-sm">
          <h5 className="fw-bold mb-3">All Expenses</h5>
          <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ExpensePage;
