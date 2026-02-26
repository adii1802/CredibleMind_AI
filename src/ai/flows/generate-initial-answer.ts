'use server';
/**
 * @fileOverview A Genkit flow for generating an initial comprehensive answer to a user's question.
 *
 * - generateInitialAnswer - A function that handles the AI answer generation process.
 * - GenerateInitialAnswerInput - The input type for the generateInitialAnswer function.
 * - GenerateInitialAnswerOutput - The return type for the generateInitialAnswer function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateInitialAnswerInputSchema = z.object({
  question: z.string().describe('The user\'s question for which to generate an answer.'),
});
export type GenerateInitialAnswerInput = z.infer<typeof GenerateInitialAnswerInputSchema>;

const GenerateInitialAnswerOutputSchema = z.object({
  answer: z.string().describe('A comprehensive initial answer to the user\'s question.'),
});
export type GenerateInitialAnswerOutput = z.infer<typeof GenerateInitialAnswerOutputSchema>;

export async function generateInitialAnswer(input: GenerateInitialAnswerInput): Promise<GenerateInitialAnswerOutput> {
  return generateInitialAnswerFlow(input);
}

const aiWriterPrompt = ai.definePrompt({
  name: 'aiWriterPrompt',
  input: { schema: GenerateInitialAnswerInputSchema },
  output: { schema: GenerateInitialAnswerOutputSchema },
  prompt: `You are an AI Writer whose job is to generate a comprehensive initial answer to a user's question. Your answer should be informative, well-structured, and provide a good starting point for further verification. Your response should be a single, coherent answer.

User Question: {{{question}}}`,
});

const generateInitialAnswerFlow = ai.defineFlow(
  {
    name: 'generateInitialAnswerFlow',
    inputSchema: GenerateInitialAnswerInputSchema,
    outputSchema: GenerateInitialAnswerOutputSchema,
  },
  async (input) => {
    const { output } = await aiWriterPrompt(input);
    if (!output) {
      throw new Error('Failed to generate initial answer.');
    }
    return output;
  }
);
