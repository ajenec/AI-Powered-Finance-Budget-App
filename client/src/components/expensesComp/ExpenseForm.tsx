import { useState, useEffect } from "react";
import { FormEvent } from "react";
import type { NewExpense, UpdateExpense } from "../../types/expense";
import { getCategoriesByType, type Category } from "../../api/categoriesFetch";

type Props = {
  initial?: UpdateExpense;
  onSubmit: (payload: NewExpense | UpdateExpense) => Promise<void> | void;
  submitLabel?: string;
};

const ExpenseForm = ({ initial, onSubmit, submitLabel = "Save" }: Props) => {
  const [form, setForm] = useState<UpdateExpense | NewExpense>(
    initial || {
      // don't include category_id by default (server treats missing/null as no category)
      amount: 0,
      date_spent: new Date().toISOString().slice(0, 10),
      description: "",
    }
  );

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (initial) {
      setForm((f) => ({
        ...(f as UpdateExpense),
        ...(initial as UpdateExpense),
      }));
    }
    const loadCats = async () => {
      try {
        const cats = await getCategoriesByType("expense");
        setCategories(cats || []);
        if (!initial && cats && cats.length > 0) {
          setForm((f) => ({
            ...(f as UpdateExpense),
            category_id: cats[0].id,
          }));
        }
      } catch (e) {
        // silently ignore; form will still work without category selection
      }
    };
    loadCats();
  }, [initial]);

  const handleChange = (key: keyof UpdateExpense, value: unknown) => {
    setForm((f) => ({ ...(f as UpdateExpense), [key]: value }));
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    await onSubmit(form as NewExpense | UpdateExpense);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 p-6 rounded-xl shadow-lg border border-white/10 h-full"
        style={{
          background: "rgba(42, 53, 68, 0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-white">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            value={(form as UpdateExpense).category_id ?? ""}
            onChange={(e) =>
              handleChange(
                "category_id",
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-[#92C5E4] focus:border-transparent outline-none"
            required
          >
            <option value="">— Select a category —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-1 flex-grow">
          <label className="text-sm font-semibold text-white">Amount</label>
          <input
            type="number"
            step="0.01"
            value={(form as UpdateExpense).amount}
            onChange={(e) =>
              handleChange("amount", parseFloat(e.target.value || "0"))
            }
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-[#92C5E4] focus:border-transparent outline-none"
          />
        </div>

        {/* Date Spent */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-white">Date Spent</label>
          <input
            type="date"
            value={(form as UpdateExpense).date_spent}
            onChange={(e) => handleChange("date_spent", e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-[#92C5E4] focus:border-transparent outline-none"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-white">
            Description
          </label>
          <input
            type="text"
            value={(form as UpdateExpense).description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-[#92C5E4] focus:border-transparent outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-[#92C5E4] to-[#B8DCF0] text-white font-semibold rounded-lg hover:from-[#7bb5d4] hover:to-[#a3cce0] transition-colors mt-auto"
        >
          {submitLabel}
        </button>
      </form>
    </>
  );
};

export default ExpenseForm;
