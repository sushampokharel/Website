import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-content-for-notes.ts';
import '@/ai/flows/generate-flashcards-from-summary.ts';