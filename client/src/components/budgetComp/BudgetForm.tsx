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
      goal_amount: 0,
    }
  );

  const [categories, setCategories] = useState<Category[]>([]);

  // If the parent provides/updates an `initial` prop (e.g. after async load),
  // keep the internal form state in sync so required fields like category_id
  // are populated before submit.
  useEffect(() => {
    if (initial) {
      setForm((f) => ({
        ...(f as UpdateBudget),
        ...(initial as UpdateBudget),
      }));
    }
    // load categories when form mounts / initial changes
    const load = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
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
    <>
      <div>
        <form
          onSubmit={handleSubmit}
          className="p-5 bg-light rounded-4 shadow-lg w-100"
          style={{ maxWidth: "400px" }}
        >
          <div>
            <label className="fw-semibold">Category</label>
            <select
              value={(form as UpdateBudget).category_id ?? ""}
              onChange={(e) =>
                handleChange(
                  "category_id",
                  e.target.value === "" ? undefined : Number(e.target.value)
                )
              }
              className="border rounded p-1 w-full"
            >
              <option value="">— No category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="fw-semibold">Period Type</label>
            <select
              value={(form as UpdateBudget).period_type}
              onChange={(e) => handleChange("period_type", e.target.value)}
              className="form-control form-control-lg"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="fw-semibold">Start Date</label>
              <input
                type="date"
                value={(form as UpdateBudget).start_date ?? ""}
                onChange={(e) => handleChange("start_date", e.target.value)}
                className="form-control form-control-lg"
              />
            </div>
            <div>
              <label className="fw-semibold">End Date</label>
              <input
                type="date"
                value={(form as UpdateBudget).end_date ?? ""}
                onChange={(e) => handleChange("end_date", e.target.value)}
                className="form-control form-control-lg"
              />
            </div>
          </div>

          <div>
            <label className="fw-semibold">Goal Amount</label>
            <input
              type="number"
              step="0.01"
              value={(form as UpdateBudget).goal_amount ?? 0}
              onChange={(e) =>
                handleChange("goal_amount", Number(e.target.value))
              }
              className="form-control form-control-lg"
            />
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary w-100 btn-lg mb-3">
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
