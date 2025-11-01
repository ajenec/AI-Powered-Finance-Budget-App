import type { Budget } from "../../types/budget";
import { getCategories, Category } from "../../api/categoriesFetch";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { ProgressBar } from "react-bootstrap";

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
        console.error("Failed to load categories:", err);
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
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle shadow-sm rounded">
        <thead className="table-success">
          <tr>
            <th>Category</th>
            <th>Period</th>
            <th>Duration</th>
            <th>Goal ($)</th>
            <th>Spent ($)</th>
            <th>Progress</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((b) => {
            const spent = b.goal_amount - b.remaining_amount;
            const progress = Math.min((spent / b.goal_amount) * 100, 100);
            const overBudget = spent > b.goal_amount;

            return (
              <tr key={b.id}>
                <td className="fw-semibold">
                  {getCategoryName(b.category_id)}
                </td>
                <td className="text-uppercase">{b.period_type}</td>
                <td>{b.start_date || "—"}</td>
                <td>${b.goal_amount.toFixed(2)}</td>
                <td className={overBudget ? "text-danger fw-semibold" : ""}>
                  ${spent.toFixed(2)}
                </td>
                <td style={{ width: "160px" }}>
                  <ProgressBar
                    now={progress}
                    variant={overBudget ? "danger" : "success"}
                    style={{ height: "8px" }}
                  />
                </td>
                <td>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(b.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      <Trash2 size={16} className="me-1" />
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetList;
