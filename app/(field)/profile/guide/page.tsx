"use client";

import { Handbook } from "../../../../shared/ui/Handbook";
import { useUserStore } from "../../../../entities/user/store";
import { ChevronLeft, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FieldGuidePage() {
  const { language } = useUserStore();
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-background p-6 animate-in fade-in duration-500">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 mb-8 hover:text-foreground transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Profile
      </button>

      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight">
          {language === "es" ? "Manual de Campo" : "Field Handbook"}
        </h1>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-rsg-gold" />
          <p className="text-foreground/40 text-[10px] font-mono font-bold uppercase tracking-widest">
            SYSTEM BLUEPRINT — v1.0.4
          </p>
        </div>
      </div>

      <Handbook language={language} />

      <div className="mt-12 pt-12 border-t-2 border-dashed border-foreground/10 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">
          Real Stone Group — Operational Integrity Unit
        </p>
      </div>
    </div>
  );
}
