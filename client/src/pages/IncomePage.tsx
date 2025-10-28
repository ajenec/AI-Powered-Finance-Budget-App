import React, { useEffect, useState } from "react";
import IncomeForm from "../components/incomesComp/IncomeForm";
import IncomeList from "../components/incomesComp/IncomeList";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
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
      <div>
        <h1>Income Page</h1>
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
        <IncomeList incomes={incomes} onDelete={handleDeleteIncome} />
      </div>
      <Footer />
    </>
  );
};

export default IncomePage;
