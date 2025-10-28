import React from "react";
import type { Income } from "../../types/income";

type Props = {
  incomes: Income[];
  onEdit?: (e: Income) => void;
  onDelete?: (id: number) => void;
};

const IncomeList: React.FC<Props> = ({ incomes, onEdit, onDelete }) => {
  if (!incomes || incomes.length === 0) {
    return <div>No incomes yet.</div>;
  }
  return (
    <>
      <ul className="space-y-2">
        {incomes.map((e) => (
          <li key={e.id}>
            <div className="border rounded p-2 flex justify-between items-center">
              <div>
                <div className="font-medium">{e.source}</div>
                <div className="text-sm text-gray-600">
                  Date: {new Date(e.received_at).toLocaleDateString()}
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

export default IncomeList;
