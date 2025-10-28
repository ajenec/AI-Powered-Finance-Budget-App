import {
  fetchHandler,
  basicFetchOptions,
  getPostOptions,
  getPatchOptions,
  getDeleteOptions,
} from "../utils/fetchHelpers";
import type { Expense, NewExpense, UpdateExpense } from "../types/expense";

// Fetch all expenses for the current user
export const getExpenses = async (): Promise<Expense[]> => {
  const [data, error] = await fetchHandler(
    "/api/expenses",
    basicFetchOptions()
  );
  if (error) throw error;
  return data as Expense[];
};

// Create a new expense
export const createExpense = async (
  expenseData: NewExpense
): Promise<Expense> => {
  const [data, error] = await fetchHandler(
    "/api/expenses",
    getPostOptions(expenseData)
  );
  if (error) throw error;
  return data as Expense;
};

// Update an existing expense
export const updateExpense = async (
  id: string | number,
  updates: UpdateExpense
): Promise<Expense | null> => {
  const [data, error] = await fetchHandler(
    `/api/expenses/${id}`,
    getPatchOptions(updates)
  );
  if (error) throw error;
  return (data as Expense) || null;
};

// Delete an expense
export const deleteExpense = async (
  id: string | number
): Promise<boolean | null> => {
  const [data, error] = await fetchHandler(
    `/api/expenses/${id}`,
    getDeleteOptions()
  );
  if (error) throw error;
  return (data as boolean) || null;
};

export default { getExpenses, createExpense, updateExpense, deleteExpense };
