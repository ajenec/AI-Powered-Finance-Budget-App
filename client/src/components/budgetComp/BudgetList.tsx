import type { Budget } from "../../types/budget";
import { getCategories, Category } from "../../api/categoriesFetch";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

type Props = {
  budgets: Budget[];
  onEdit?: (b: Budget) => void;
  onDelete?: (id: number) => void;
};

const BudgetList = ({ budgets, onEdit: _onEdit, onDelete }: Props) => {
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
      <div className="text-center text-white/60 py-8">
        No budgets yet. Create your first goal to start tracking!
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
          <tr className="border-b border-white/10">
            <th className="text-center py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-white">
              Category
            </th>
            <th className="text-center py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-white">
              Period
            </th>
            <th className="text-center py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-white">
              Goal
            </th>
            <th className="text-center py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-white">
              Spent
            </th>
            <th className="text-center py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-white">
              Progress
            </th>
            <th className="text-center py-3 px-3 md:py-4 md:px-6 text-xs md:text-sm font-semibold text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((b) => {
            const spent = b.goal_amount - b.remaining_amount;
            const progress = Math.min((spent / b.goal_amount) * 100, 100);
            const overBudget = spent > b.goal_amount;

            return (
              <tr
                key={b.id}
                className="border-b border-white/5 hover:bg-white/5 transition-all duration-200 group"
              >
                <td className="py-3 px-3 md:py-4 md:px-6 text-white font-medium whitespace-normal break-words">
                  {getCategoryName(b.category_id)}
                </td>
                <td className="py-3 px-3 md:py-4 md:px-6">
                  <span className="capitalize text-sm text-white/90 bg-white/10 px-3 py-1 rounded-full">
                    {b.period_type}
                  </span>
                </td>
                <td className="py-3 px-3 md:py-4 md:px-6 text-white font-semibold">
                  ${b.goal_amount.toFixed(2)}
                </td>
                <td
                  className={`py-3 px-3 md:py-4 md:px-6 font-semibold ${
                    overBudget ? "text-red-400" : "text-green-400"
                  }`}
                >
                  ${spent.toFixed(2)}
                </td>
                <td className="py-3 px-3 md:py-4 md:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex gap-2 h-5 md:h-6">
                        {/* Spent bar */}
                        <div className="flex-1 bg-white/10 rounded-lg overflow-hidden relative border border-white/5">
                          <div
                            className={`h-full transition-all duration-300 ${
                              overBudget ? "bg-red-500" : "bg-green-500"
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium text-white drop-shadow">
                              Spent
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between mt-1.5">
                        <small className="text-xs text-white/70">
                          {Math.round(progress)}% used
                        </small>
                        <small
                          className={`text-xs ${
                            overBudget ? "text-red-400" : "text-white/70"
                          }`}
                        >
                          ${b.remaining_amount.toFixed(2)} left
                        </small>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 md:py-4 md:px-6 text-center">
                  {onDelete && (
                    <button
                      onClick={() => onDelete(b.id)}
                      className="inline-flex items-center justify-center p-2 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
                      title="Delete budget"
                    >
                      <Trash2 size={18} />
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
