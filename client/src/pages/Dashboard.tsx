import React, { useEffect, useState } from "react";
import NavBar from "../components/ui/NavBar";
import Footer from "../components/ui/Footer";
import { getExpenses } from "../api/expensesFetch";
import { getIncomes } from "../api/incomesFetch";
import { getBudgets } from "../api/budgetsFetch";
import type { Expense } from "../types/expense";
import type { Income } from "../types/income";
import type { Budget } from "../types/budget";

const currency = (value: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      try {
        setLoading(true);
        const [expensesData, incomesData, budgetsData] = await Promise.all([
          getExpenses(),
          getIncomes(),
          getBudgets(),
        ]);
        if (!mounted) return;
        setExpenses(expensesData || []);
        setIncomes(incomesData || []);
        setBudgets(budgetsData || []);
      } catch (err: any) {
        console.error("Error fetching dashboard data", err);
        if (mounted) setError(err?.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      mounted = false;
    };
  }, []);

  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const totalIncomes = incomes.reduce((s, i) => s + Number(i.amount || 0), 0);

  const today = new Date();
  const currentBudget =
    budgets.find((b) => {
      try {
        const start = new Date(b.start_date);
        const end = new Date(b.end_date);
        return start <= today && today <= end;
      } catch {
        return false;
      }
    }) ||
    budgets[0] ||
    null;

  return (
    <>
      <NavBar />

      <main className="container mt-4" style={{ paddingBottom: "90px" }}>
        {/* <h1 className="mb-4"></h1> */}

        {loading && <p>Loading dashboard data…</p>}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Total Expenses</h5>
                  <p className="card-text display-6">
                    {currency(totalExpenses)}
                  </p>
                  <small className="text-muted">
                    From all recorded expenses
                  </small>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Total Income</h5>
                  <p className="card-text display-6">
                    {currency(totalIncomes)}
                  </p>
                  <small className="text-muted">
                    From all recorded incomes
                  </small>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Current Budget</h5>
                  {currentBudget ? (
                    <>
                      <p className="card-text mb-1">
                        Goal: {currency(currentBudget.goal_amount)}
                      </p>
                      <p className="card-text mb-1">
                        Remaining: {currency(currentBudget.remaining_amount)}
                      </p>
                      <p className="card-text">
                        <small className="text-muted">
                          {currentBudget.period_type} •{" "}
                          {new Date(
                            currentBudget.start_date
                          ).toLocaleDateString()}{" "}
                          —{" "}
                          {new Date(
                            currentBudget.end_date
                          ).toLocaleDateString()}
                        </small>
                      </p>
                    </>
                  ) : (
                    <p className="card-text">No budgets found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Dashboard;
