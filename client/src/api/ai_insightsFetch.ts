import {
  fetchHandler,
  getPostOptions,
  basicFetchOptions,
} from "../utils/fetchHelpers";
import type { AIInsightPayload, AIInsightResponse } from "../types/aiInsight";

// === Routes ===
const BASE = "/ai_insights";

/**
 * Fetch all AI insights for the current user.
 */
export const getAIInsights = async (): Promise<AIInsightResponse[]> => {
  const [data, error] = await fetchHandler(BASE, basicFetchOptions());
  if (error) throw error;
  return data as AIInsightResponse[];
};

/**
 * Generate a new AI insight by sending totals and pct changes.
 */
export const generateAIInsight = async (
  payload: AIInsightPayload
): Promise<AIInsightResponse> => {
  const [data, error] = await fetchHandler(
    `${BASE}/generate`,
    getPostOptions(payload)
  );
  if (error) throw error;
  return data as AIInsightResponse;
};
