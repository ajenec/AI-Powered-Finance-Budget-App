import React, { useEffect, useState } from "react";
import type { Expense } from "../../types/expense";
import { getCategories, Category } from "../../api/categoriesFetch";
import { Trash2 } from "lucide-react";

type Props = {
  expenses: Expense[];
  onEdit?: (e: Expense) => void;
  onDelete?: (id: number) => void;
};

const ExpenseList: React.FC<Props> = ({ expenses, onEdit, onDelete }) => {
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

  if (!expenses || expenses.length === 0) {
    return <div>No expenses yet.</div>;
  }
  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle shadow-sm rounded">
          <thead className="table-success">
            <tr>
              <th>Date Spent</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount ($)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id}>
                <td>{new Date(e.date_spent).toLocaleDateString()}</td>
                <td className="fw-semibold">
                  {getCategoryName(e.category_id)}
                </td>
                <td>{e.description || "-"}</td>
                <td>{e.amount.toFixed(2)}</td>
                <td>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(e.id)}
                      title="Delete Expense"
                      className="btn btn-sm btn-outline-danger"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ExpenseList;
