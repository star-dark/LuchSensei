'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending lunch options based on user preferences, recent meal history, and restaurant ratings.
 *
 * The flow takes user preferences and meal history as input, analyzes nearby restaurants,
 * and recommends a suitable lunch option.
 *
 * @exports {
 *   recommendLunch: (input: RecommendLunchInput) => Promise<RecommendLunchOutput>;
 *   RecommendLunchInput: type
 *   RecommendLunchOutput: type
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendLunchInputSchema = z.object({
  tastePreference: z
    .string()
    .describe('The user taste preference. e.g. spicy, sweet, savory'),
  recentMeals: z
    .array(z.string())
    .describe('List of names of meals the user has eaten recently.'),
  restaurantRatings: z
    .string()
    .describe('The star ratings of restaurants near the user.'),
  userLocation: z.string().describe('The current location of the user.'),
});
export type RecommendLunchInput = z.infer<typeof RecommendLunchInputSchema>;

const RecommendLunchOutputSchema = z.object({
  restaurantName: z.string().describe('The name of the recommended restaurant.'),
  cuisine: z.string().describe('The type of cuisine the restaurant serves.'),
  menuItem: z.string().describe('The recommended menu item at the restaurant.'),
  address: z.string().describe('The address of the restaurant.'),
  contactNumber: z.string().describe('The contact number of the restaurant.'),
  operationHour: z.string().describe('The operation hours of the restaurant.'),
  naverMapLink: z.string().describe('The link to the restaurant on Naver Maps.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the lunch recommendation.'),
});
export type RecommendLunchOutput = z.infer<typeof RecommendLunchOutputSchema>;

const recommendLunchPrompt = ai.definePrompt({
  name: 'recommendLunchPrompt',
  input: {schema: RecommendLunchInputSchema},
  output: {schema: RecommendLunchOutputSchema},
  prompt: `You are LunchSensei, a helpful AI assistant that recommends lunch options to users based on their preferences, recent meal history, and restaurant ratings and current location.

  Analyze the user's taste preference, recent meals, restaurant ratings, and the user location to suggest a suitable lunch option.
  Make sure to consider user's taste and the restaurants star ratings, reviews, and popularity, while also incorporating user's recent meal history to avoid repetition.

  Taste Preference: {{{tastePreference}}}
  Recent Meals: {{#each recentMeals}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Restaurant Ratings: {{{restaurantRatings}}}
  User Location: {{{userLocation}}}

  Based on the information above, recommend a lunch option. Provide the restaurant name, cuisine, a recommended menu item, address, contact number, operation hour, a link to Naver Maps and a brief explanation of why you are recommending this option.

  Please provide the output in JSON format.
  `,
});

const recommendLunchFlow = ai.defineFlow(
  {
    name: 'recommendLunchFlow',
    inputSchema: RecommendLunchInputSchema,
    outputSchema: RecommendLunchOutputSchema,
  },
  async input => {
    const {output} = await recommendLunchPrompt(input);
    return output!;
  }
);

export async function recommendLunch(input: RecommendLunchInput): Promise<RecommendLunchOutput> {
  return recommendLunchFlow(input);
}
