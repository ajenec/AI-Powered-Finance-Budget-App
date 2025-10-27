import {
  fetchHandler,
  basicFetchOptions,
  getPostOptions,
  getPatchOptions,
} from "../utils/fetchHelpers";
import { TOKEN_KEY } from "../utils/token";

export const login = async (email: string, password: string) => {
  const [data, error] = await fetchHandler(
    "/api/auth/login",
    getPostOptions({ email, password })
  );
  if (error) throw error;

  // Store JWT token if present (backend returns 'access_token')
  if (data && data.access_token) {
    localStorage.setItem(TOKEN_KEY, data.access_token);
  }
  return data;
};

export const signup = async (
  firstname: string,
  lastname: string,
  username: string,
  email: string,
  password: string
) => {
  const [data, error] = await fetchHandler(
    "/api/auth/register",
    // Backend expects snake_case keys: first_name, last_name
    getPostOptions({
      first_name: firstname,
      last_name: lastname,
      username: username,
      email: email,
      password: password,
    })
  );
  if (error) throw error;
  return data;
};

export const fetchUser = async () => {
  const [data, error] = await fetchHandler(
    "/api/auth/profile",
    basicFetchOptions()
  );
  if (error) throw error;
  return data;
};

export const updateUserProfile = async (updates: Record<string, unknown>) => {
  // Update the currently authenticated user's profile via auth profile endpoint
  const [data, error] = await fetchHandler(
    "/api/auth/profile",
    getPatchOptions(updates)
  );
  if (error) throw error;
  return data;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Validate token by calling the load endpoint
export const validateToken = async (): Promise<boolean> => {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    const [, error] = await fetchHandler(
      "/api/auth/profile",
      basicFetchOptions()
    );
    if (error) {
      // Token is invalid or expired
      localStorage.removeItem(TOKEN_KEY);
      return false;
    }

    // Token is valid
    return true;
  } catch (error) {
    // Network error or server down
    console.error("Error validating token:", error);
    localStorage.removeItem(TOKEN_KEY);
    return false;
  }
};
