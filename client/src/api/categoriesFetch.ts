import { fetchHandler, basicFetchOptions } from "../utils/fetchHelpers";

// Minimal category shape used by the UI
export interface Category {
  id: number;
  name: string;
  type_of?: string;
  user_id?: number;
  is_default?: boolean;
}

export const getCategories = async (): Promise<Category[]> => {
  const [data, error] = await fetchHandler(
    "/api/categories",
    basicFetchOptions()
  );
  if (error) throw error;
  return data as Category[];
};

export default { getCategories };
