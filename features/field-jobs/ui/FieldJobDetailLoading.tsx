import { Loader2 } from "lucide-react";

export function FieldJobDetailLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 field-rugged">
      <div className="rugged-card p-8 flex flex-col items-center gap-4 border-dashed">
        <Loader2 className="w-12 h-12 animate-spin text-rsg-gold" strokeWidth={3} />
        <span className="font-mono text-[10px] uppercase font-black tracking-widest text-foreground/40">
          Syncing Field Intel...
        </span>
      </div>
    </div>
  );
}
