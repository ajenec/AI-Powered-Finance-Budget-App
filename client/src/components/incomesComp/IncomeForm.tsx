import React from "react";
import { useState, useEffect } from "react";
import { FormEvent } from "react";
import type { NewIncome, UpdateIncome } from "../../types/income";

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

  useEffect(() => {
    if (initial) {
      setForm((f) => ({
        ...(f as UpdateIncome),
        ...(initial as UpdateIncome),
      }));
    }
  }, [initial]);

  const handleChange = (key: keyof UpdateIncome, value: unknown) => {
    setForm((f) => ({ ...(f as UpdateIncome), [key]: value }));
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    await onSubmit(form as NewIncome | UpdateIncome);
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
            value={(form as UpdateIncome).amount}
            onChange={(e) => handleChange("amount", e.target.value)}
          />
          <p className="text-sm text-gray-500">Enter the amount of income</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Source</label>
          <input
            type="text"
            className="border rounded p-1 w-full"
            value={(form as UpdateIncome).source}
            onChange={(e) => handleChange("source", e.target.value)}
          />
          <p className="text-sm text-gray-500">Enter the source of income</p>
        </div>
        <div>
          <button type="submit">{submitLabel}</button>
        </div>
      </form>
    </>
  );
};

export default IncomeForm;
