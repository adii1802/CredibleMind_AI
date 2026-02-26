'use server';
/**
 * @fileOverview This file implements a Genkit flow for verifying and classifying claims within an AI-generated answer.
 *
 * - verifyClaims - A function that orchestrates the claim verification and classification process.
 * - VerifyClaimsInput - The input type for the verifyClaims function.
 * - VerifyClaimsOutput - The return type for the verifyClaims function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VerifyClaimsInputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to be verified.'),
  internalDocuments: z.array(z.string()).describe('A collection of internal documents to use for fact-checking.'),
});
export type VerifyClaimsInput = z.infer<typeof VerifyClaimsInputSchema>;

const ClaimSchema = z.object({
  text: z.string().describe('The text of the extracted claim.'),
  classification: z.union([
    z.literal('verified'),
    z.literal('partially supported'),
    z.literal('unsupported'),
  ]).describe('The classification of the claim based on fact-checking.'),
  evidence: z.array(z.string()).describe('Snippets from internal documents supporting or refuting the claim.'),
  confidence: z.number().describe('The confidence score (0-1).'),
  reasoning: z.string().describe('Short reasoning for the classification.'),
});

const VerifyClaimsOutputSchema = z.array(ClaimSchema);
export type VerifyClaimsOutput = z.infer<typeof VerifyClaimsOutputSchema>;

export async function verifyClaims(input: VerifyClaimsInput): Promise<VerifyClaimsOutput> {
  return verifyClaimsFlow(input);
}

const extractClaimsPrompt = ai.definePrompt({
  name: 'extractClaimsPrompt',
  input: { schema: z.object({ answer: z.string() }) },
  output: { 
    schema: z.array(z.object({
      claim_id: z.number(),
      claim_text: z.string(),
    })).describe('An array of atomic claims extracted from the text.') 
  },
  prompt: `You are a factual verification assistant.

Break the following AI-generated answer into independent factual claims.

Each claim must:
- Be atomic
- Be verifiable
- Avoid opinion-based content

Return output in JSON format:

[
  {
    "claim_id": 1,
    "claim_text": "..."
  }
]

AI Response:
"""
{{{answer}}}
"""`,
});

const checkClaimPrompt = ai.definePrompt({
  name: 'checkClaimPrompt',
  input: {
    schema: z.object({
      claim: z.string().describe('The single claim to verify.'),
      documents: z.array(z.string()).describe('The internal documents for fact-checking.'),
    }),
  },
  output: {
    schema: z.object({
      claim: z.string().describe('The claim being checked.'),
      status: z.union([
        z.literal('VERIFIED'),
        z.literal('PARTIALLY_SUPPORTED'),
        z.literal('UNSUPPORTED'),
      ]).describe('The classification of the claim.'),
      confidence: z.number().describe('Confidence score between 0 and 1.'),
      reasoning: z.string().describe('Short reasoning for the status.'),
      evidence: z.array(z.string()).describe('Specific snippets from the documents that serve as evidence for the classification.'),
    }),
  },
  prompt: `You are a strict fact-checking agent.

You are given:
1. A factual claim.
2. Retrieved evidence snippets from internal documents.

Your task:
- Determine if the claim is supported.
- Classify as:
  - VERIFIED
  - PARTIALLY_SUPPORTED
  - UNSUPPORTED

- Provide short reasoning.
- Return confidence score (0–1).

Return output in JSON format:

{
  "claim": "...",
  "status": "...",
  "confidence": 0.0,
  "reasoning": "...",
  "evidence": ["Snippet 1", "Snippet 2"]
}

Claim:
{{{claim}}}

Evidence:
{{#each documents}}
--- Document ---
{{{this}}}

{{/each}}

Remember, use only the provided evidence to verify the claim. Extract specific snippets that support or refute the claim into the 'evidence' array.`,
});

const verifyClaimsFlow = ai.defineFlow(
  {
    name: 'verifyClaimsFlow',
    inputSchema: VerifyClaimsInputSchema,
    outputSchema: VerifyClaimsOutputSchema,
  },
  async (input) => {
    const { answer, internalDocuments } = input;

    // Step 1: Extract claims from the answer
    const { output: extractedClaims } = await extractClaimsPrompt({ answer });

    if (!extractedClaims || extractedClaims.length === 0) {
      return [];
    }

    // Step 2: Fact-check each claim against internal documents
    const verifiedClaims: VerifyClaimsOutput = [];
    for (const claim of extractedClaims) {
      const { output: checkResult } = await checkClaimPrompt({ 
        claim: claim.claim_text, 
        documents: internalDocuments 
      });
      
      if (checkResult) {
        // Map uppercase status to frontend compatible lowercase classification
        let classification: 'verified' | 'partially supported' | 'unsupported' = 'unsupported';
        if (checkResult.status === 'VERIFIED') classification = 'verified';
        if (checkResult.status === 'PARTIALLY_SUPPORTED') classification = 'partially supported';

        verifiedClaims.push({
          text: checkResult.claim,
          classification: classification,
          evidence: checkResult.evidence,
          confidence: checkResult.confidence,
          reasoning: checkResult.reasoning,
        });
      }
    }

    return verifiedClaims;
  }
);
