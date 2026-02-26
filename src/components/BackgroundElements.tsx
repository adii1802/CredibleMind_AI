"use client";

export function BackgroundElements() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
      <div className="absolute top-[40%] right-[15%] w-[200px] h-[200px] bg-primary/3 rounded-full blur-[80px] animate-pulse-glow" />
    </div>
  );
}
