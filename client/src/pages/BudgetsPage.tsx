import React from "react";
import BudgetForm from "../components/budgetComp/BudgetForm";
import BudgetList from "../components/budgetComp/BudgetList";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const BudgetsPage: React.FC = () => {
  return (
    <>
      <NavBar />
      <div>
        <h1>Budgets Page</h1>
        <BudgetForm budget={0} />
        <BudgetList budgets={[]} />
      </div>
      <Footer />
    </>
  );
};

export default BudgetsPage;
