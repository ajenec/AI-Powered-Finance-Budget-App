import React from "react";
import BudgetForm from "../components/budgetComp/BudgetForm";
import BudgetList from "../components/budgetComp/BudgetList";

const BudgetsPage: React.FC = () => {
  return (
    <div>
      <h1>Budgets Page</h1>
      <BudgetForm budget={0} />
      <BudgetList budgets={[]} />
    </div>
  );
};

export default BudgetsPage;
