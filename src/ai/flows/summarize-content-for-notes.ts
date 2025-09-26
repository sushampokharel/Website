'use server';
/**
 * @fileOverview Summarizes content into concise notes using AI.
 *
 * - summarizeContentForNotes - A function that summarizes the content.
 * - SummarizeContentForNotesInput - The input type for the summarizeContentForNotes function.
 * - SummarizeContentForNotesOutput - The return type for the summarizeContentForNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeContentForNotesInputSchema = z.object({
  content: z.string().describe('The content to be summarized.'),
});
export type SummarizeContentForNotesInput = z.infer<typeof SummarizeContentForNotesInputSchema>;

const SummarizeContentForNotesOutputSchema = z.object({
  summary: z.string().describe('The summarized content.'),
});
export type SummarizeContentForNotesOutput = z.infer<typeof SummarizeContentForNotesOutputSchema>;

export async function summarizeContentForNotes(input: SummarizeContentForNotesInput): Promise<SummarizeContentForNotesOutput> {
  return summarizeContentForNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeContentForNotesPrompt',
  input: {schema: SummarizeContentForNotesInputSchema},
  output: {schema: SummarizeContentForNotesOutputSchema},
  prompt: `Summarize the following content into concise notes:\n\n{{{content}}}`,
});

const summarizeContentForNotesFlow = ai.defineFlow(
  {
    name: 'summarizeContentForNotesFlow',
    inputSchema: SummarizeContentForNotesInputSchema,
    outputSchema: SummarizeContentForNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
