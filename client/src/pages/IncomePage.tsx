import React, { useEffect, useState } from "react";
import IncomeForm from "../components/incomesComp/IncomeForm";
import IncomeList from "../components/incomesComp/IncomeList";
import IncomeChart from "../components/incomesComp/IncomeChart";
import SideNav from "../components/ui/SideNav";
import Footer from "../components/ui/Footer";
import type { Income, NewIncome } from "../types/income";
import { createIncome, getIncomes, deleteIncome } from "../api/incomesFetch";
import { getToken } from "../api/authFetch";

const IncomePage: React.FC = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadIncomes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIncomes();
      setIncomes(data || []);
    } catch (err: any) {
      console.error("Failed to load incomes:", err);
      setError(err?.message || "Failed to load incomes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncomes();
    const handleFocus = () => loadIncomes();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
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

  // 🧮 Calculate total
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <>
      <SideNav />
      <div className="min-h-screen pl-72 pr-6 py-8 overflow-x-hidden">
        {/* Page Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-1">Incomes</h1>
          <p>Track and grow your earnings</p>
        </div>

        {error && <div className="text-red-400 mb-4">{error}</div>}

        {/* ---------- TOP SECTION: Overview + Chart + Form ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* LEFT SIDE: Overview + Pie Chart */}
          <div className="flex flex-col gap-6">
            <div
              className="space-y-2 rounded-xl p-6 border border-white/10 shadow-lg"
              style={{
                background: "rgba(42, 53, 68, 0.7)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <h2 className="text-xl font-semibold mb-3 text-white">
                Total Overview
              </h2>
              <div className="space-y-2 text-white/90">
                <p>
                  <strong>Total Income:</strong> ${totalIncome.toFixed(2)}
                </p>
                <p className="text-sm text-white/70">
                  Track all your income sources and categories
                </p>
              </div>
            </div>

            {/* Pie Chart below Overview */}
            <div className="w-full flex justify-center">
              <IncomeChart incomes={incomes} />
            </div>
          </div>

          {/* RIGHT SIDE: Form */}
          <div className="flex justify-center items-stretch h-full">
            <div className="w-full max-w-md h-full flex flex-col">
              <IncomeForm
                onSubmit={async (payload) => {
                  try {
                    const token = getToken();
                    if (!token) {
                      setError("You must be signed in to create income.");
                      return;
                    }
                    await createIncome(payload as NewIncome);
                    await loadIncomes();
                  } catch (err: any) {
                    console.error("Failed to create income:", err);
                    setError(err?.message || "Failed to create income");
                  }
                }}
                submitLabel="Create Income"
              />
            </div>
          </div>
        </div>

        {/* ---------- BOTTOM SECTION: Income List ---------- */}
        <div className="flex flex-col gap-8">
          {loading ? (
            <div>Loading incomes...</div>
          ) : (
            <IncomeList incomes={incomes} onDelete={handleDeleteIncome} />
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default IncomePage;
