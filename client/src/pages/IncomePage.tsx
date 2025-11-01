import React, { useEffect, useState } from "react";
import IncomeForm from "../components/incomesComp/IncomeForm";
import IncomeList from "../components/incomesComp/IncomeList";
import IncomeChart from "../components/incomesComp/IncomeChart";
import NavBar from "../components/ui/NavBar";
import Footer from "../components/ui/Footer";
import type { Income, NewIncome } from "../types/income";
import { createIncome, getIncomes, deleteIncome } from "../api/incomesFetch";

const IncomePage: React.FC = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);

  const loadIncomes = async () => {
    try {
      const data = await getIncomes();
      setIncomes(data);
    } catch (err) {
      console.error("Failed to load incomes:", err);
    }
  };

  useEffect(() => {
    loadIncomes();
  }, []);

  const handleDeleteIncome = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this income?"
    );
    if (!confirmDelete) return;

    try {
      await deleteIncome(id);
      setIncomes((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to delete income:", err);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container my-5">
        <h1 className="text-center mb-4">Income Tracker</h1>

        {/* ----------- TOP SECTION: Total + Form | Chart ----------- */}
        <div className="row g-4 mb-5">
          {/* Left Side: Total + Form */}
          <div className="col-md-6">
            {/* Total Income */}
            <div className="card p-3 mb-4 shadow-sm">
              <h2 className="h5 mb-2">Total Income</h2>
              <p className="fs-4 fw-bold">
                ${incomes.reduce((sum, inc) => sum + inc.amount, 0).toFixed(2)}
              </p>
            </div>

            {/* Income Form */}
            <IncomeForm
              onSubmit={async (payload) => {
                try {
                  await createIncome(payload as NewIncome);
                  await loadIncomes();
                } catch (err) {
                  console.error("Failed to create income:", err);
                }
              }}
            />
          </div>

          {/* Right Side: Chart  */}
          <div className="col-md-6">
            <IncomeChart incomes={incomes} />
          </div>
        </div>

        {/* ----------- BOTTOM SECTION: Expense List ----------- */}
        <div className="card p-4 shadow-sm">
          <IncomeList incomes={incomes} onDelete={handleDeleteIncome} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default IncomePage;
