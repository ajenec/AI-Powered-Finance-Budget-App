import {
  fetchHandler,
  basicFetchOptions,
  getPostOptions,
  getPatchOptions,
  getDeleteOptions,
} from "../utils/fetchHelpers";
import type { Income, NewIncome, UpdateIncome } from "../types/income";

export const getIncomes = async (): Promise<Income[]> => {
  const [data, error] = await fetchHandler("/api/incomes", basicFetchOptions());
  if (error) throw error;
  return data as Income[];
};

export const createIncome = async (incomeData: NewIncome): Promise<Income> => {
  const [data, error] = await fetchHandler(
    "/api/incomes",
    getPostOptions(incomeData)
  );
  if (error) throw error;
  return data as Income;
};

export const updateIncome = async (
  id: string | number,
  updates: UpdateIncome
): Promise<Income | null> => {
  const [data, error] = await fetchHandler(
    `/api/incomes/${id}`,
    getPatchOptions(updates)
  );
  if (error) throw error;
  return (data as Income) || null;
};

export const deleteIncome = async (
  id: string | number
): Promise<boolean | null> => {
  const [data, error] = await fetchHandler(
    `/api/incomes/${id}`,
    getDeleteOptions()
  );
  if (error) throw error;
  return (data as boolean) || null;
};

export default { getIncomes, createIncome, updateIncome, deleteIncome };
