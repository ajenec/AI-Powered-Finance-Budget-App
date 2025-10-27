import React from "react";
import ExpenseForm from "../components/expensesComp/ExpenseForm";
import ExpenseList from "../components/expensesComp/ExpenseList";

const ExpensePage: React.FC = () => {
  return (
    <div>
      <h1>Expense Page</h1>
      <ExpenseForm />
      <ExpenseList />
    </div>
  );
};

export default ExpensePage;
