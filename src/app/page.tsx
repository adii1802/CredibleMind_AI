"use client";

import { useState, useEffect, useMemo } from "react";
import { generateInitialAnswer } from "@/ai/flows/generate-initial-answer";
import { verifyClaims, VerifyClaimsOutput } from "@/ai/flows/verify-claims";
import { MOCK_INTERNAL_DOCUMENTS } from "@/lib/mock-data";
import { calculateTrustScore } from "@/lib/trust-score";
import { VerificationPanel } from "@/components/VerificationPanel";
import { ClaimText } from "@/components/ClaimText";
import { ProcessFlow } from "@/components/ProcessFlow";
import { BackgroundElements } from "@/components/BackgroundElements";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  Loader2, 
  Search, 
  Send, 
  BrainCircuit, 
  History,
  FileSearch,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Info
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Firebase imports
import { useFirestore, useDoc, useCollection } from "@/firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit 
} from "firebase/firestore";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function Home() {
  const firestore = useFirestore();
  const [question, setQuestion] = useState("");
  const [activeQueryId, setActiveQueryId] = useState<string | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<VerifyClaimsOutput[0] | null>(null);
  const [refId, setRefId] = useState<string>("");

  useEffect(() => {
    setRefId(`AI-${Math.floor(Math.random() * 10000)}`);
  }, []);

  const activeQueryRef = useMemo(() => {
    if (!firestore || !activeQueryId) return null;
    return doc(firestore, "queries", activeQueryId);
  }, [firestore, activeQueryId]);
  
  const { data: activeQuery } = useDoc(activeQueryRef);

  const historyQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "queries"), orderBy("createdAt", "desc"), limit(5));
  }, [firestore]);
  
  const { data: history } = useCollection(historyQuery);

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !firestore) return;

    const queriesCol = collection(firestore, "queries");
    const newDocRef = doc(queriesCol);
    const queryId = newDocRef.id;

    setActiveQueryId(queryId);

    setDoc(newDocRef, {
      question,
      status: "generating",
      createdAt: serverTimestamp(),
      answer: "",
      claims: [],
      metrics: null
    }).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: newDocRef.path,
        operation: 'create',
      }));
    });

    try {
      const writerOutput = await generateInitialAnswer({ question });
      
      updateDoc(newDocRef, {
        answer: writerOutput.answer,
        status: "verifying"
      });

      const editorOutput = await verifyClaims({ 
        answer: writerOutput.answer, 
        internalDocuments: MOCK_INTERNAL_DOCUMENTS 
      });

      const m = calculateTrustScore(editorOutput);
      
      updateDoc(newDocRef, {
        claims: editorOutput,
        metrics: m,
        status: "complete"
      });

    } catch (error) {
      console.error("Workflow failed:", error);
      updateDoc(newDocRef, { status: "error" });
    }
  };

  const currentStatus = activeQuery?.status || "idle";
  const currentAnswer = activeQuery?.answer || "";
  const currentClaims = activeQuery?.claims || [];
  const currentMetrics = activeQuery?.metrics || null;

  return (
    <div className="flex flex-col min-h-screen font-body selection:bg-accent/30">
      <BackgroundElements />

      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full bg-white/40 border-b border-white/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-[0_8px_16px_rgba(51,102,153,0.3)] rotate-3">
              <BrainCircuit className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-headline font-black text-primary tracking-tight">CredibleMind AI</h1>
              <p className="text-[9px] uppercase font-black text-muted-foreground tracking-[0.4em]">Truth Extraction Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="hidden sm:flex border-primary/20 text-primary bg-primary/5 px-3 py-1 gap-1.5 font-bold uppercase tracking-widest text-[10px]">
              <History className="h-3 w-3" />
              History: {history?.length || 0}
            </Badge>
            <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/5">
              <Info className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12 relative">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Floating Input Panel */}
          <section className="animate-fade-in">
            <div className="glass-panel p-8 rounded-[2.5rem] group relative transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
              <div className="absolute -top-3 -left-3 bg-accent text-accent-foreground text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg rotate-[-2deg] shadow-lg">
                Ask the Engine
              </div>
              <form onSubmit={handleProcess} className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-primary/40" />
                  <Input 
                    placeholder="Enter a topic or claim to verify against internal knowledge..." 
                    className="pl-14 h-16 text-lg rounded-[1.5rem] border-primary/10 bg-white focus:bg-white transition-all shadow-inner focus:ring-accent/40"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={currentStatus === "generating" || currentStatus === "verifying"}
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="h-16 px-10 rounded-[1.5rem] bg-primary hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/20 group/btn"
                  disabled={(currentStatus === "generating" || currentStatus === "verifying") || !question.trim()}
                >
                  {currentStatus === "generating" || currentStatus === "verifying" ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <div className="flex items-center gap-3">
                      <Send className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                      <span className="font-bold tracking-tight">Verify Now</span>
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </section>

          {/* Process Flow Visualization */}
          {(currentStatus !== "idle" && currentStatus !== "error") && (
            <ProcessFlow currentStatus={currentStatus} />
          )}

          {/* Main Content Layout */}
          {(currentStatus === "complete" || (currentStatus === "verifying" && currentAnswer)) && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Answer Column */}
              <div className="lg:col-span-8 space-y-8 animate-fade-in">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-3xl font-headline font-black text-primary">Verification Analysis</h2>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest bg-white/50 px-3 py-1.5 rounded-full border border-white/60">
                    Ref: {refId}
                  </div>
                </div>
                
                <ClaimText 
                  fullText={currentAnswer} 
                  claims={currentClaims} 
                  onClaimClick={(claim) => setSelectedClaim(claim)} 
                />

                {currentStatus === "verifying" && (
                  <div className="flex items-center gap-4 p-6 bg-accent/5 rounded-[2rem] border border-accent/20 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <FileSearch className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-primary uppercase tracking-widest">Verifying Content</p>
                      <p className="text-xs text-muted-foreground">Mapping atomic claims against primary internal documents...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Column */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                {currentMetrics ? (
                  <VerificationPanel metrics={currentMetrics} />
                ) : (
                  <div className="glass-panel h-[400px] flex items-center justify-center rounded-[2rem] bg-muted/10 border-dashed border-2">
                    <div className="text-center p-8 space-y-4">
                      <Loader2 className="h-10 w-10 text-primary/30 animate-spin mx-auto" />
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Calculating Metrics</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Onboarding State */}
          {currentStatus === "idle" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
              {[
                { 
                  icon: <BrainCircuit className="h-8 w-8" />, 
                  title: "Writer Agent", 
                  desc: "Drafts comprehensive technical responses based on your input parameters." 
                },
                { 
                  icon: <FileSearch className="h-8 w-8" />, 
                  title: "Editor Verification", 
                  desc: "Fragments text into verifiable units and cross-references them in real-time." 
                },
                { 
                  icon: <ShieldCheck className="h-8 w-8" />, 
                  title: "Trust Score", 
                  desc: "Assigns objective credibility weights to provide a final transparency score." 
                }
              ].map((feat, i) => (
                <div key={i} className="glass-panel p-10 rounded-[2.5rem] group hover:bg-primary hover:text-white transition-all duration-500 cursor-default">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-primary/5 flex items-center justify-center text-primary group-hover:bg-white/20 group-hover:text-white transition-colors duration-500 mb-6">
                    {feat.icon}
                  </div>
                  <h3 className="text-2xl font-headline font-black mb-4 tracking-tight">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-white/80 leading-relaxed font-medium">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Slide-out Evidence Detail */}
      <Sheet open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg border-l-0 p-0 flex flex-col bg-background">
          <SheetHeader className="p-10 bg-primary text-white space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[60px] -mr-32 -mt-32" />
            <div className="flex items-center justify-between relative z-10">
              <Badge variant="outline" className="text-white border-white/20 uppercase text-[10px] font-black tracking-[0.3em] bg-white/10 px-3 py-1">
                Evidence Portal
              </Badge>
              {selectedClaim?.classification === 'verified' ? (
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                  <ShieldCheck className="h-6 w-6 text-green-400" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                  <AlertTriangle className="h-6 w-6 text-orange-400" />
                </div>
              )}
            </div>
            <SheetTitle className="text-3xl font-headline font-black text-white leading-tight relative z-10">
              Claim Breakdown
            </SheetTitle>
            <SheetDescription className="text-white/70 font-medium leading-relaxed relative z-10">
              Transparency details for the selected segment, cross-referenced with internal documentation.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-10 space-y-12">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">The Claim</h4>
              <p className="text-xl font-bold italic text-primary leading-relaxed bg-primary/5 p-6 rounded-[1.5rem] border border-primary/10">
                "{selectedClaim?.text}"
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Evidence Snippets
              </h4>
              
              {selectedClaim?.evidence && selectedClaim.evidence.length > 0 ? (
                <div className="space-y-6">
                  {selectedClaim.evidence.map((snippet, i) => (
                    <div key={i} className="group relative pl-6">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors rounded-full" />
                      <p className="text-sm text-foreground leading-relaxed font-medium bg-white p-5 rounded-2xl border border-border group-hover:border-primary/20 transition-all">
                        {snippet}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-[10px] font-black text-primary uppercase cursor-pointer hover:underline tracking-widest">
                        <ExternalLink className="h-3 w-3" />
                        Source: Internal Knowledge Base
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 glass-panel rounded-[2rem] border-dashed">
                  <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center">
                    <FileSearch className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  <div className="space-y-2 px-10">
                    <p className="text-sm font-black uppercase tracking-widest text-foreground">No Evidence Found</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">This claim was not found in our internal verified reports.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-10 bg-white border-t border-border">
            <Button className="w-full h-16 rounded-[1.25rem] font-bold text-lg shadow-xl" variant="outline" onClick={() => setSelectedClaim(null)}>
              Return to Analysis
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
