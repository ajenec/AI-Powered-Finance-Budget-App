import { fetchHandler, basicFetchOptions } from "../utils/fetchHelpers";

// Global category shape - categories are now static and shared across all users
export interface Category {
  id: number;
  name: string;
  type_of: string; // 'income' or 'expense'
  created_at?: string;
}

/**
 * Fetch all global categories
 * No authentication required as categories are public/read-only
 */
export const getCategories = async (): Promise<Category[]> => {
  const [data, error] = await fetchHandler(
    "/api/categories",
    basicFetchOptions()
  );
  if (error) throw error;
  return data as Category[];
};

/**
 * Fetch categories filtered by type
 * @param type - 'income' or 'expense'
 */
export const getCategoriesByType = async (
  type: "income" | "expense"
): Promise<Category[]> => {
  const [data, error] = await fetchHandler(
    `/api/categories/${type}`,
    basicFetchOptions()
  );
  if (error) throw error;
  return data as Category[];
};

export default { getCategories, getCategoriesByType };
