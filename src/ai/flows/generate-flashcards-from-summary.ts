'use server';
/**
 * @fileOverview Generates flashcards from a summarized text using AI.
 *
 * - generateFlashcardsFromSummary - A function that generates flashcards from a summary.
 * - GenerateFlashcardsFromSummaryInput - The input type for the generateFlashcardsFromSummary function.
 * - GenerateFlashcardsFromSummaryOutput - The return type for the generateFlashcardsFromSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFlashcardsFromSummaryInputSchema = z.object({
  summary: z.string().describe('The summarized text to generate flashcards from.'),
});
export type GenerateFlashcardsFromSummaryInput = z.infer<typeof GenerateFlashcardsFromSummaryInputSchema>;

const GenerateFlashcardsFromSummaryOutputSchema = z.object({
  flashcards: z
    .array(z.object({question: z.string(), answer: z.string()}))
    .describe('An array of flashcards generated from the summary.'),
  progress: z.string().describe('One-sentence progress summary'),
});
export type GenerateFlashcardsFromSummaryOutput = z.infer<typeof GenerateFlashcardsFromSummaryOutputSchema>;

export async function generateFlashcardsFromSummary(
  input: GenerateFlashcardsFromSummaryInput
): Promise<GenerateFlashcardsFromSummaryOutput> {
  return generateFlashcardsFromSummaryFlow(input);
}

const generateFlashcardsPrompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: {schema: GenerateFlashcardsFromSummaryInputSchema},
  output: {schema: GenerateFlashcardsFromSummaryOutputSchema},
  prompt: `You are an expert in generating flashcards for students.
  Given a summary of lecture notes, generate a list of flashcards (question and answer pairs) that will help students review the material effectively.
  The flashcards should cover the most important concepts and key details from the summary.

  Summary: {{{summary}}}

  Format the output as a JSON object with a "flashcards" array. Each object in the array should have a "question" and an "answer" field.
  Include a short, one-sentence progress summary in the "progress" field.
  `,
});

const generateFlashcardsFromSummaryFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFromSummaryFlow',
    inputSchema: GenerateFlashcardsFromSummaryInputSchema,
    outputSchema: GenerateFlashcardsFromSummaryOutputSchema,
  },
  async input => {
    const {output} = await generateFlashcardsPrompt(input);
    return output!;
  }
);
