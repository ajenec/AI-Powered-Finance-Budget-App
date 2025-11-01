import React, { useEffect, useState } from "react";
import type { Income } from "../../types/income";
import { getCategories, Category } from "../../api/categoriesFetch";
import { Trash2 } from "lucide-react";

type Props = {
  incomes: Income[];
  onEdit?: (e: Income) => void;
  onDelete?: (id: number) => void;
};

const IncomeList: React.FC<Props> = ({ incomes, onEdit, onDelete }) => {
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

  if (!incomes || incomes.length === 0) {
    return <div>No incomes yet.</div>;
  }
  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle shadow-sm rounded">
          <thead className="table-success">
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Source</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((inc) => (
              <tr key={inc.id}>
                <td>{new Date(inc.received_at).toLocaleDateString()}</td>
                <td>{getCategoryName(inc.category_id) ?? "Uncategorized"}</td>
                <td>{inc.description || "-"}</td>
                <td>{inc.source}</td>
                <td className="fw-semibold">{inc.amount.toFixed(2)}</td>
                <td>
                  {onEdit && <button onClick={() => onEdit(inc)}>Edit</button>}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(inc.id)}
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

export default IncomeList;
