import React, { useEffect, useState } from "react";
import type { Expense } from "../../types/expense";
import { getCategories, Category } from "../../api/categoriesFetch";
import { Trash2 } from "lucide-react";

type Props = {
  expenses: Expense[];
  onEdit?: (e: Expense) => void;
  onDelete?: (id: number) => void;
};

const ExpenseList: React.FC<Props> = ({
  expenses,
  onEdit: _onEdit,
  onDelete,
}) => {
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
    return (
      <div className="text-center text-white/60 py-8">
        No expenses yet. Create your first expense to start tracking!
      </div>
    );
  }
  // table-striped
  return (
    <>
      <div
        className="overflow-x-auto rounded-xl border border-white/10 shadow-lg"
        style={{
          background: "rgba(42, 53, 68, 0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <table className="w-full border-collapse text-sm md:text-base">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-center py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-white">
                Date Spent
              </th>
              <th className="text-center py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-white">
                Category
              </th>
              <th className="text-center py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-white">
                Description
              </th>
              <th className="text-center py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-white">
                Amount
              </th>
              <th className="text-center py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr
                key={e.id}
                className="border-b border-white/5 hover:bg-black/20 transition-colors duration-300 group"
              >
                <td className="py-3 px-3 md:py-4 md:px-6 text-white font-medium text-center">
                  {new Date(e.date_spent).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="py-3 px-3 md:py-4 md:px-6 text-white font-medium whitespace-normal break-words text-center">
                  {getCategoryName(e.category_id)}
                </td>
                <td className="py-3 px-3 md:py-4 md:px-6 text-white/90 text-center">
                  {e.description || "-"}
                </td>
                <td className="py-3 px-3 md:py-4 md:px-6 text-white font-semibold text-center">
                  ${e.amount.toFixed(2)}
                </td>
                <td className="py-3 px-3 md:py-4 md:px-6 text-center">
                  {onDelete && (
                    <button
                      onClick={() => onDelete(e.id)}
                      className="inline-flex items-center justify-center p-2 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
                      title="Delete expense"
                    >
                      <Trash2 size={18} />
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
