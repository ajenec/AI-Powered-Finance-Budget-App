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
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    if (initial) {
      setForm((f) => ({
        ...(f as UpdateIncome),
        ...(initial as UpdateIncome),
      }));
    }
  }, [initial]);

  useEffect(() => {
    const load = async () => {
      try {
        const cats = await getCategoriesByType("income");
        setCategories(cats || []);
      } catch (err) {
        console.error("Failed to load income categories:", err);
      } finally {
        setLoadingCats(false);
      }
    };
    load();
  }, []);

  const handleChange = (key: keyof UpdateIncome, value: unknown) => {
    setForm((f) => ({ ...(f as UpdateIncome), [key]: value }));
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    await onSubmit(form as NewIncome | UpdateIncome);
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 p-md-5 rounded shadow-sm"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <div className="mb-3">
            <label className="form-label fw-semibold">Amount</label>
            <input
              type="number"
              step="0.01"
              value={(form as UpdateIncome).amount}
              onChange={(e) =>
                handleChange("amount", parseFloat(e.target.value || "0"))
              }
              className="form-control"
            />
          </div>
          <div>
            <label className="form-label fw-semibold">Source</label>
            <input
              type="text"
              className="form-control"
              value={(form as UpdateIncome).source}
              onChange={(e) => handleChange("source", e.target.value)}
            />
          </div>
          <div>
            <label className="form-label fw-semibold">Category</label>
            <select
              className="form-select"
              value={(form as UpdateIncome).category_id ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                handleChange("category_id", v === "" ? null : Number(v));
              }}
              disabled={loadingCats}
            >
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500">
              Optional: pick an income category
            </p>
          </div>

          <button className="btn btn-primary w-100 fw-semibold" type="submit">
            {submitLabel}
          </button>
        </form>
      </div>
    </>
  );
};

export default IncomeForm;
