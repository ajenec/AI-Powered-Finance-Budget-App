import {
  fetchHandler,
  basicFetchOptions,
  getPostOptions,
  getPatchOptions,
  getDeleteOptions,
} from "../utils/fetchHelpers";
import type { Budget, NewBudget, UpdateBudget } from "../types/budget";

// Get all budgets for the current user
export const getBudgets = async (): Promise<Budget[]> => {
  const [data, error] = await fetchHandler("/api/budgets", basicFetchOptions());
  if (error) throw error;
  return data as Budget[];
};

// Create a new budget
export const createBudget = async (budgetData: NewBudget): Promise<Budget> => {
  const [data, error] = await fetchHandler(
    "/api/budgets",
    getPostOptions(budgetData)
  );
  console.log("createBudget data:", data, "error:", error);
  if (error) throw error;
  return data as Budget;
};

// Update an existing budget
export const updateBudget = async (
  id: string | number,
  updates: UpdateBudget
): Promise<Budget | null> => {
  const [data, error] = await fetchHandler(
    `/api/budgets/${id}`,
    getPatchOptions(updates)
  );
  if (error) throw error;
  return (data as Budget) || null;
};

// Delete a budget
export const deleteBudget = async (
  id: string | number
): Promise<boolean | null> => {
  const [data, error] = await fetchHandler(
    `/api/budgets/${id}`,
    getDeleteOptions()
  );
  if (error) throw error;
  return (data as boolean) || null;
};
