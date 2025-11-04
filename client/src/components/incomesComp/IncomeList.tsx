import React, { useEffect, useState } from "react";
import type { Income } from "../../types/income";
import { getCategories, Category } from "../../api/categoriesFetch";
import { Trash2 } from "lucide-react";

type Props = {
  incomes: Income[];
  onEdit?: (e: Income) => void;
  onDelete?: (id: number) => void;
};

const IncomeList: React.FC<Props> = ({
  incomes,
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

  if (!incomes || incomes.length === 0) {
    return (
      <div className="text-center text-white/60 py-8">
        No income yet. Create your first income to start tracking!
      </div>
    );
  }

  return (
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
          <tr className="border-b border-white/10 transition-colors duration-300 group hover:bg-black/20">
            <th className="text-center py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-black/40 group-hover:text-white">
              Date
            </th>
            <th className="text-center py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-black/40 group-hover:text-white">
              Category
            </th>
            <th className="text-center py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-black/40 group-hover:text-white">
              Description
            </th>
            <th className="text-center py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-black/40 group-hover:text-white">
              Source
            </th>
            <th className="text-center py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-black/40 group-hover:text-white">
              Amount
            </th>
            <th className="text-center py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-black/40 group-hover:text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((inc) => (
            <tr
              key={inc.id}
              className="border-b border-white/5 hover:bg-black/20 transition-colors duration-300 group"
            >
              <td className="py-3 px-3 md:py-4 md:px-6 text-white font-medium text-center">
                {new Date(inc.received_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="py-3 px-3 md:py-4 md:px-6 text-white font-medium whitespace-normal break-words text-center">
                {getCategoryName(inc.category_id) ?? "Uncategorized"}
              </td>
              <td className="py-3 px-3 md:py-4 md:px-6 text-white/90 text-center">
                {inc.description || "-"}
              </td>
              <td className="py-3 px-3 md:py-4 md:px-6 text-white/90 text-center">
                {inc.source}
              </td>
              <td className="py-3 px-3 md:py-4 md:px-6 text-white font-semibold text-center">
                ${inc.amount.toFixed(2)}
              </td>
              <td className="py-3 px-3 md:py-4 md:px-6 text-center">
                {onDelete && (
                  <button
                    onClick={() => onDelete(inc.id)}
                    className="inline-flex items-center justify-center p-2 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
                    title="Delete income"
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
  );
};

export default IncomeList;
