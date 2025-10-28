export interface Budget {
  id: number;
  user_id: number;
  // category may be nullable on the server; make optional here
  category_id?: number | null;
  period_type: string; // e.g. 'monthly', 'yearly'
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  goal_amount: number;
  remaining_amount: number;
  created_at: string; // ISO date string
}

// Data required to create a new budget. `remaining_amount` is optional and
// will default to `goal_amount` on the server if omitted.
export type NewBudget = Omit<Budget, "id" | "created_at"> & {
  remaining_amount?: number;
};

// Partial update shape for budgets
export type UpdateBudget = Partial<NewBudget>;
