export interface Expense {
  id: number;
  user_id: number;
  // category_id may be nullable on the server, make it optional here
  category_id?: number | null;
  amount: number;
  date_spent: string; // ISO date string
  description: string;
  created_at: string; // ISO date string
}

// Data required to create a new expense.
export type NewExpense = Omit<Expense, "id" | "created_at">;

// Partial update shape for expenses
export type UpdateExpense = Partial<NewExpense>;
