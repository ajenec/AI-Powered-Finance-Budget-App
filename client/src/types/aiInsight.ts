export interface AIInsightResponse {
  savings_tip: string;
  budget_summary: string;
  expense_advice: string;
  [key: string]: string;
}

export interface AIInsightPayload {
  total_income: number;
  total_expenses: number;
  expense_change_pct: number;
  income_change_pct: number;
}
