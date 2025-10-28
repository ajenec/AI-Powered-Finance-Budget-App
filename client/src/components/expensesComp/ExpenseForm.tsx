import { useState, useEffect } from "react";
import { FormEvent } from "react";
import type { NewExpense, UpdateExpense } from "../../types/expense";

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

  useEffect(() => {
    if (initial) {
      setForm((f) => ({
        ...(f as UpdateExpense),
        ...(initial as UpdateExpense),
      }));
    }
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
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label className="block text-sm font-medium">Amount</label>
          <input
            type="number"
            step="0.01"
            className="border rounded p-1 w-full"
            value={(form as UpdateExpense).amount}
            onChange={(e) =>
              handleChange("amount", parseFloat(e.target.value || "0"))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Date Spent</label>
          <input
            type="date"
            value={(form as UpdateExpense).date_spent}
            onChange={(e) => handleChange("date_spent", e.target.value)}
            className="border rounded p-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <input
            type="text"
            value={(form as UpdateExpense).description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="border rounded p-1 w-full"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </>
  );
};

export default ExpenseForm;
