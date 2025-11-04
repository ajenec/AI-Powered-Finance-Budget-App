import { useState, useEffect } from "react";
import { FormEvent } from "react";
import type { NewIncome, UpdateIncome } from "../../types/income";
import { getCategoriesByType, type Category } from "../../api/categoriesFetch";

type Props = {
  initial?: UpdateIncome;
  onSubmit: (payload: NewIncome | UpdateIncome) => Promise<void> | void;
  submitLabel?: string;
};

const IncomeForm = ({ initial, onSubmit, submitLabel = "Save" }: Props) => {
  const [form, setForm] = useState<UpdateIncome | NewIncome>(
    initial || {
      amount: 0,
      source: "",
      received_at: new Date().toISOString().slice(0, 10),
    }
  );
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (initial) {
      setForm((f) => ({
        ...(f as UpdateIncome),
        ...(initial as UpdateIncome),
      }));
    }

    const load = async () => {
      try {
        const cats = await getCategoriesByType("income");
        setCategories(cats || []);
        // If creating new income and categories are loaded, pre-select the first one
        if (!initial && cats && cats.length > 0) {
          setForm((f) => ({
            ...(f as UpdateIncome),
            category_id: cats[0].id,
          }));
        }
      } catch (err) {
        console.error("Failed to load income categories:", err);
      }
    };
    load();
  }, [initial]);

  const handleChange = (key: keyof UpdateIncome, value: unknown) => {
    setForm((f) => ({ ...(f as UpdateIncome), [key]: value }));
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    await onSubmit(form as NewIncome | UpdateIncome);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 p-6 rounded-xl shadow-lg border border-white/10 h-full"
      style={{
        background: "rgba(42, 53, 68, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <h5 className="text-xl font-semibold text-white mb-2">{submitLabel}</h5>

      {/* Amount */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-white">
          Amount <span className="text-red-400">*</span>
        </label>
        <input
          type="number"
          step="0.01"
          value={(form as UpdateIncome).amount}
          onChange={(e) =>
            handleChange("amount", parseFloat(e.target.value || "0"))
          }
          className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-[#92C5E4] focus:border-transparent outline-none"
          required
        />
      </div>

      {/* Source */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-white">
          Source <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={(form as UpdateIncome).source}
          onChange={(e) => handleChange("source", e.target.value)}
          className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-[#92C5E4] focus:border-transparent outline-none"
          required
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-white">
          Category <span className="text-red-400">*</span>
        </label>
        <select
          value={(form as UpdateIncome).category_id ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            handleChange("category_id", v === "" ? undefined : Number(v));
          }}
          className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-[#92C5E4] focus:border-transparent outline-none"
          required
        >
          <option value="" className="bg-gray-800">
            — Select a category —
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id} className="bg-gray-800">
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Received At Date */}
      <div className="flex flex-col gap-1 flex-grow">
        <label className="text-sm font-semibold text-white">
          Date Received
        </label>
        <input
          type="date"
          value={(form as UpdateIncome).received_at ?? ""}
          onChange={(e) => handleChange("received_at", e.target.value)}
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
  );
};

export default IncomeForm;
