import React from "react";
import type { Expense } from "../../types/expense";

type Props = {
  expenses: Expense[];
  onEdit?: (e: Expense) => void;
  onDelete?: (id: number) => void;
};

const ExpenseList: React.FC<Props> = ({ expenses, onEdit, onDelete }) => {
  if (!expenses || expenses.length === 0) {
    return <div>No expenses yet.</div>;
  }
  return (
    <>
      <ul className="space-y-2">
        {expenses.map((e) => (
          <li key={e.id}>
            <div className="border rounded p-2 flex justify-between items-center">
              <div>
                <div className="font-medium">{e.description}</div>
                <div className="text-sm text-gray-600">
                  Date: {new Date(e.date_spent).toLocaleDateString()}
                </div>
                <div className="text-sm">Amount: ${e.amount.toFixed(2)}</div>
              </div>
              <div className="space-x-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(e)}
                    className="text-sm text-blue-600"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(e.id)}
                    className="text-sm text-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ExpenseList;
