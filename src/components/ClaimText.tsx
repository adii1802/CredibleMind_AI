"use client";

import { cn } from "@/lib/utils";
import { VerifyClaimsOutput } from "@/ai/flows/verify-claims";

interface ClaimTextProps {
  fullText: string;
  claims: VerifyClaimsOutput;
  onClaimClick: (claim: VerifyClaimsOutput[0]) => void;
}

export function ClaimText({ fullText, claims, onClaimClick }: ClaimTextProps) {
  if (!claims.length) return <p className="leading-relaxed whitespace-pre-wrap">{fullText}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.3em]">AI Generated Response</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      
      <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
        
        <div className="relative z-10 flex flex-wrap gap-2">
          {claims.map((claim, idx) => {
            const styles = {
              verified: "claim-verified",
              unsupported: "claim-unsupported",
              "partially supported": "claim-partial"
            };

            return (
              <span 
                key={idx}
                onClick={() => onClaimClick(claim)}
                className={cn(
                  "claim-item inline-block px-3 py-2 text-sm md:text-base animate-fade-in",
                  styles[claim.classification as keyof typeof styles]
                )}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {claim.text}
              </span>
            );
          })}
        </div>
      </div>
      
      <p className="text-center text-xs text-muted-foreground font-medium italic">
        Hover and click on specific claims to see the primary source evidence used for verification.
      </p>
    </div>
  );
}
