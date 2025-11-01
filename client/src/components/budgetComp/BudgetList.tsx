import type { Budget } from "../../types/budget";
import { ProgressBar } from "react-bootstrap";
import { Wallet, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { getCategories, Category } from "../../api/categoriesFetch";

type Props = {
  budgets: Budget[];
  onEdit?: (b: Budget) => void;
  onDelete?: (id: number) => void;
};

const BudgetList = ({ budgets, onEdit, onDelete }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const load = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats || []);
      } catch (err) {
        // ignore error, just show ID if categories fail
      }
    };
    load();
  }, []);

  const getCategoryName = (id?: number | null) => {
    if (!id) return "Unknown";
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : `ID ${id}`;
  };

  if (!budgets || budgets.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        No budgets yet. Create your first goal to start tracking!
      </div>
    );
  }
  return (
    <div className="d-flex flex-column gap-3">
      {budgets.map((b) => {
        const spent = b.goal_amount - b.remaining_amount;
        const progress = Math.min((spent / b.goal_amount) * 100, 100);
        const overBudget = spent > b.goal_amount;

        return (
          <div
            key={b.id}
            className="card shadow-sm border-0 rounded-3"
            style={{ backgroundColor: "#f9f9f9" }}
          >
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-bold mb-1">
                  <Wallet size={18} className="me-2 text-success" />
                  {getCategoryName(b.category_id)}
                </div>
                <div className="text-muted small mb-2">
                  {b.period_type.toUpperCase()}
                </div>

                <div className="small">
                  Goal:{" "}
                  <span className="fw-semibold">
                    ${b.goal_amount.toFixed(2)}
                  </span>
                </div>
                <div className="small mb-2">
                  Remaining:{" "}
                  <span
                    className={`fw-semibold ${
                      overBudget ? "text-danger" : "text-success"
                    }`}
                  >
                    ${b.remaining_amount.toFixed(2)}
                  </span>
                </div>

                <ProgressBar
                  now={progress}
                  variant={overBudget ? "danger" : "success"}
                  label={`${Math.round(progress)}%`}
                  style={{ height: "8px" }}
                />
              </div>

              <div className="text-end">
                {onEdit && (
                  <button
                    onClick={() => onEdit(b)}
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    <TrendingUp size={16} className="me-1" />
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(b.id)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    <TrendingDown size={16} className="me-1" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetList;
