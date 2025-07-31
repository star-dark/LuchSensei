"use server";

import { recommendLunch, type RecommendLunchInput, type RecommendLunchOutput } from "@/ai/flows/recommend-lunch";

export async function getLunchRecommendation(
  input: RecommendLunchInput
): Promise<{ data: RecommendLunchOutput | null; error: string | null }> {
  try {
    const result = await recommendLunch(input);
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { data: null, error: `Failed to get recommendation: ${errorMessage}` };
  }
}