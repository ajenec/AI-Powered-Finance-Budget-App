import React, { useEffect, useState } from "react";
import ExpenseForm from "../components/expensesComp/ExpenseForm";
import ExpenseList from "../components/expensesComp/ExpenseList";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
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
      console.error("Failed to load incomes:", err);
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

  return (
    <>
      <NavBar />
      <div>
        <h1>Expense Page</h1>
        <ExpenseForm
          onSubmit={async (payload) => {
            try {
              await createExpense(payload as NewExpense);
              await loadExpense();
            } catch (err) {
              console.error("Failed to create income:", err);
            }
          }}
        />
        <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
      </div>
      <Footer />
    </>
  );
};

export default ExpensePage;
