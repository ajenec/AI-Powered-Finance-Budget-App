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
      <div className="d-flex justify-content-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 p-md-5 rounded shadow-sm"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          {/* Category */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Category <span className="text-danger">*</span>
            </label>
            <select
              value={(form as UpdateExpense).category_id ?? ""}
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

          {/* Amount */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Amount</label>
            <input
              type="number"
              step="0.01"
              value={(form as UpdateExpense).amount}
              onChange={(e) =>
                handleChange("amount", parseFloat(e.target.value || "0"))
              }
              className="form-control"
            />
          </div>

          {/* Date Spent */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Date Spent</label>
            <input
              type="date"
              value={(form as UpdateExpense).date_spent}
              onChange={(e) => handleChange("date_spent", e.target.value)}
              className="form-control"
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <input
              type="text"
              value={(form as UpdateExpense).description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-semibold">
            {submitLabel}
          </button>
        </form>
      </div>
    </>
  );
};

export default ExpenseForm;
