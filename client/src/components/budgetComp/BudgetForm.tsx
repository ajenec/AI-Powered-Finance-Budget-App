import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import type { NewBudget, UpdateBudget } from "../../types/budget";
import { getCategories } from "../../api/categoriesFetch";
import type { Category } from "../../api/categoriesFetch";

type Props = {
  initial?: UpdateBudget;
  onSubmit: (payload: NewBudget | UpdateBudget) => Promise<void> | void;
  submitLabel?: string;
};

export default function BudgetForm({
  initial,
  onSubmit,
  submitLabel = "Save",
}: Props) {
  const [form, setForm] = useState<UpdateBudget | NewBudget>(
    initial || {
      period_type: "monthly",
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date().toISOString().slice(0, 10),
      goal_amount: 0.0,
    }
  );

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (initial) {
      setForm((f) => ({
        ...(f as UpdateBudget),
        ...(initial as UpdateBudget),
      }));
    }

    const load = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
        // If creating a new budget and categories are loaded, pre-select the first one
        if (!initial && data && data.length > 0) {
          setForm((f) => ({
            ...(f as UpdateBudget),
            category_id: data[0].id,
          }));
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    load();
  }, [initial]);

  const handleChange = (key: keyof UpdateBudget, value: unknown) => {
    setForm((f) => ({ ...(f as UpdateBudget), [key]: value }));
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    await onSubmit(form as NewBudget | UpdateBudget);
  };

  return (
    <div className="d-flex justify-content-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 p-md-5 rounded shadow-sm"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h3 className="mb-4 text-center fw-bold text-primary">
          {submitLabel} Budget
        </h3>

        {/* Category */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Category <span className="text-danger">*</span>
          </label>
          <select
            value={(form as UpdateBudget).category_id ?? ""}
            onChange={(e) =>
              handleChange(
                "category_id",
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
            className="form-select"
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

        {/* Period Type */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Period Type</label>
          <select
            value={(form as UpdateBudget).period_type}
            onChange={(e) => handleChange("period_type", e.target.value)}
            className="form-select"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Start & End Dates */}
        <div className="row g-2 mb-3">
          <div className="col-6">
            <label className="form-label fw-semibold">Start Date</label>
            <input
              type="date"
              value={(form as UpdateBudget).start_date ?? ""}
              onChange={(e) => handleChange("start_date", e.target.value)}
              className="form-control"
            />
          </div>
          <div className="col-6">
            <label className="form-label fw-semibold">End Date</label>
            <input
              type="date"
              value={(form as UpdateBudget).end_date ?? ""}
              onChange={(e) => handleChange("end_date", e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        {/* Goal Amount */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Goal Amount</label>
          <input
            type="number"
            step="0.01"
            value={(form as UpdateBudget).goal_amount}
            onChange={(e) =>
              handleChange("goal_amount", Number(e.target.value))
            }
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 fw-semibold">
          {submitLabel}
        </button>
      </form>
    </div>
  );
}
