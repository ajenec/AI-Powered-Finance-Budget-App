// No runtime React import needed with the new JSX transform
import type { Budget } from "../../types/budget";

type Props = {
  budgets: Budget[];
  onEdit?: (b: Budget) => void;
  onDelete?: (id: number) => void;
};

export default function BudgetList({ budgets, onEdit, onDelete }: Props) {
  if (!budgets || budgets.length === 0) {
    return <div>No budgets yet.</div>;
  }

  return (
    <ul className="space-y-2">
      {budgets.map((b) => (
        <li
          key={b.id}
          className="border rounded p-2 flex justify-between items-center"
        >
          <div>
            <div className="font-medium">Category {b.category_id}</div>
            <div className="text-sm text-gray-600">{b.period_type}</div>
            <div className="text-sm">Goal: ${b.goal_amount.toFixed(2)}</div>
            <div className="text-sm">
              Remaining: ${b.remaining_amount.toFixed(2)}
            </div>
          </div>
          <div className="space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(b)}
                className="text-sm text-blue-600"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(b.id)}
                className="text-sm text-red-600"
              >
                Delete
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
