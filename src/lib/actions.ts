"use server";

import { summarizeContentForNotes } from "@/ai/flows/summarize-content-for-notes";
import { generateFlashcardsFromSummary } from "@/ai/flows/generate-flashcards-from-summary";
import type { Flashcard } from "./types";

type ActionResponse = {
  summary?: string;
  flashcards?: Flashcard[];
  error?: string;
};

export async function generateStudyAidsAction(input: {
  content: string;
}): Promise<ActionResponse> {
  const { content } = input;
  
  if (!content || content.trim().length < 50) {
    return { error: "Please provide at least 50 characters of content." };
  }

  try {
    const summaryResult = await summarizeContentForNotes({ content });
    if (!summaryResult?.summary) {
      return { error: "Failed to generate summary. The AI model may be offline." };
    }

    const flashcardsResult = await generateFlashcardsFromSummary({ summary: summaryResult.summary });
    if (!flashcardsResult?.flashcards || flashcardsResult.flashcards.length === 0) {
      return { error: "Failed to generate flashcards from the summary. The content might be too short or ambiguous." };
    }

    return {
      summary: summaryResult.summary,
      flashcards: flashcardsResult.flashcards,
    };
  } catch (e) {
    console.error("Error in generateStudyAidsAction:", e);
    return { error: "An unexpected error occurred while communicating with the AI. Please try again later." };
  }
}
