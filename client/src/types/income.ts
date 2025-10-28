export interface Income {
  id: number;
  user_id: number;
  category_id?: number | null;
  amount: number;
  source: string;
  received_at: string; // ISO date string
  created_at?: string; // ISO date string, optional
}

// Data required to create a new income
export type NewIncome = Omit<Income, "id" | "created_at">;

// Partial update shape for incomes
export type UpdateIncome = Partial<NewIncome>;
