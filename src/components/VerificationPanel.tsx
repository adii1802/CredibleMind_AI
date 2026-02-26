"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrustScoreCounter } from "./TrustScoreCounter";
import { TrustScoreMetrics } from "@/lib/trust-score";
import { ShieldCheck, AlertTriangle, Info, FileText, Zap, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface VerificationPanelProps {
  metrics: TrustScoreMetrics;
}

export function VerificationPanel({ metrics }: VerificationPanelProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-panel p-8 rounded-[2rem] text-center space-y-8">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest border-primary/20 text-primary">
            Analysis Summary
          </Badge>
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>

        <TrustScoreCounter score={metrics.score} />

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Verified', val: metrics.verifiedCount, color: 'text-green-600' },
            { label: 'Partial', val: metrics.partialCount, color: 'text-orange-600' },
            { label: 'Untrusted', val: metrics.unsupportedCount, color: 'text-red-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/50 p-3 rounded-2xl border border-white/40">
              <div className={`text-xl font-bold ${stat.color}`}>{stat.val}</div>
              <div className="text-[9px] text-muted-foreground uppercase font-bold">{stat.label}</div>
            </div>
          ))}
        </div>

        <Separator className="bg-primary/10" />

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white/40 rounded-xl border border-white/60">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
              Risk Level
            </span>
            <Badge variant={metrics.riskLevel === 'Low' ? 'default' : metrics.riskLevel === 'Medium' ? 'secondary' : 'destructive'} className="rounded-lg">
              {metrics.riskLevel}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white/40 rounded-xl border border-white/60">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-accent" />
              AI Confidence
            </span>
            <span className="text-sm font-bold text-primary">{metrics.avgConfidence}%</span>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-[2rem] space-y-4 border-dashed border-primary/20 bg-primary/5">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
          <Info className="h-3.5 w-3.5" />
          Methodology
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Scores are derived from a weighted consensus model. <span className="text-primary font-bold">Verified</span> claims carry 100% weight, while <span className="text-orange-600 font-bold">Partially Supported</span> carry 50%.
        </p>
        <div className="flex items-center justify-between text-[10px] font-bold text-primary uppercase pt-2 cursor-pointer group">
          View Detail Logic
          <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}
