import { VerifyClaimsOutput } from "@/ai/flows/verify-claims";

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface TrustScoreMetrics {
  score: number;
  verifiedCount: number;
  partialCount: number;
  unsupportedCount: number;
  totalClaims: number;
  avgConfidence: number;
  riskLevel: RiskLevel;
}

/**
 * Trust Score Calculation Logic
 * 
 * Formula: Score = (BaseCredibility * ConfidenceModifier) * 100
 * 
 * 1. Base Credibility (Weighting):
 *    - Verified: 1.0 (Gold standard, fully grounded)
 *    - Partially Supported: 0.5 (Consensus-based, but lacking direct citation)
 *    - Unsupported: 0.0 (Factual failure or direct contradiction)
 * 
 * 2. Confidence Modifier:
 *    - A 20% swing factor based on AI's internal confidence (0.8 + 0.2 * AvgConfidence).
 *    - This ensures that high-certainty verification is rewarded and "lucky guesses" are tempered.
 * 
 * 3. Risk Level:
 *    - Low: High score and zero unsupported claims.
 *    - Medium: Any unsupported claim or score below 80%.
 *    - High: Multiple unsupported claims or score below 50%.
 */
export function calculateTrustScore(claims: VerifyClaimsOutput): TrustScoreMetrics {
  if (claims.length === 0) {
    return {
      score: 0,
      verifiedCount: 0,
      partialCount: 0,
      unsupportedCount: 0,
      totalClaims: 0,
      avgConfidence: 0,
      riskLevel: 'Low',
    };
  }

  const verified = claims.filter(c => c.classification === 'verified').length;
  const partial = claims.filter(c => c.classification === 'partially supported').length;
  const unsupported = claims.filter(c => c.classification === 'unsupported').length;
  
  // Calculate average confidence from 0 to 1
  const avgConfidence = claims.reduce((acc, c) => acc + c.confidence, 0) / claims.length;

  // 1. Calculate Base Credibility
  const baseCredibility = ((verified * 1.0) + (partial * 0.5) + (unsupported * 0.0)) / claims.length;

  // 2. Calculate Confidence Modifier (0.8 to 1.0)
  const confidenceModifier = 0.8 + (0.2 * avgConfidence);

  // 3. Final Weighted Score
  const rawScore = Math.round(baseCredibility * confidenceModifier * 100);

  // 4. Determine Risk Level
  let riskLevel: RiskLevel = 'Low';
  if (unsupported > 0 || rawScore < 80) riskLevel = 'Medium';
  if (unsupported > 1 || rawScore < 50) riskLevel = 'High';

  return {
    score: rawScore,
    verifiedCount: verified,
    partialCount: partial,
    unsupportedCount: unsupported,
    totalClaims: claims.length,
    avgConfidence: Math.round(avgConfidence * 100), // Return as percentage for UI
    riskLevel,
  };
}
