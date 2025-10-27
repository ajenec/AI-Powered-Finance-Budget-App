import React from "react";
import IncomeForm from "../components/incomesComp/IncomeForm";
import IncomeList from "../components/incomesComp/IncomeList";

const IncomePage: React.FC = () => {
  return (
    <div>
      <h1>Income Page</h1>
      <IncomeForm />
      <IncomeList />
    </div>
  );
};

export default IncomePage;
