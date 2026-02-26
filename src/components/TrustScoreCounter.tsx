"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TrustScoreCounterProps {
  score: number;
  className?: string;
}

export function TrustScoreCounter({ score, className }: TrustScoreCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayValue / 100) * circumference;

  useEffect(() => {
    const duration = 2000; 
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4); // ease-out-quart
      
      setDisplayValue(Math.floor(easedProgress * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const getColorClass = (val: number) => {
    if (val >= 80) return "stroke-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]";
    if (val >= 50) return "stroke-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]";
    return "stroke-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]";
  };

  const getTextColorClass = (val: number) => {
    if (val >= 80) return "text-green-600";
    if (val >= 50) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg className="w-40 h-40 transform -rotate-90">
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-muted/30"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("transition-all duration-100 ease-out", getColorClass(displayValue))}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-4xl font-headline font-bold", getTextColorClass(displayValue))}>
          {displayValue}%
        </span>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Trust</span>
      </div>
    </div>
  );
}
