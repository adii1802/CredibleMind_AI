"use client";

import { BrainCircuit, FileSearch, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessFlowProps {
  currentStatus: string;
}

export function ProcessFlow({ currentStatus }: ProcessFlowProps) {
  const steps = [
    { id: 'generating', label: 'Writer AI', icon: <BrainCircuit className="h-5 w-5" /> },
    { id: 'extracting', label: 'Claim Extraction', icon: <Zap className="h-5 w-5" /> },
    { id: 'verifying', label: 'Evidence Check', icon: <FileSearch className="h-5 w-5" /> },
    { id: 'complete', label: 'Trust Score', icon: <ShieldCheck className="h-5 w-5" /> },
  ];

  const getStatusIndex = (status: string) => {
    if (status === 'generating') return 0;
    if (status === 'verifying') return 2;
    if (status === 'complete') return 3;
    return -1;
  };

  const currentIndex = getStatusIndex(currentStatus);

  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto w-full px-4 py-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex flex-col items-center gap-3 relative group">
          <div 
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg border-2",
              currentIndex >= index 
                ? "bg-primary text-white border-primary" 
                : "bg-white text-muted-foreground border-border",
              currentIndex === index && "animate-pulse ring-4 ring-primary/20 scale-110"
            )}
          >
            {step.icon}
          </div>
          <span className={cn(
            "text-[10px] uppercase font-bold tracking-widest text-center",
            currentIndex >= index ? "text-primary" : "text-muted-foreground"
          )}>
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <div className="absolute top-7 left-full w-[calc(100%-14px)] h-0.5 -translate-x-1/2 -translate-y-1/2 z-[-1] overflow-hidden hidden sm:block">
              <div className={cn(
                "h-full transition-all duration-1000",
                currentIndex > index ? "bg-primary w-full" : "bg-border w-0"
              )} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
