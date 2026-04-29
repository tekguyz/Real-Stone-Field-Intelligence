"use client";

import { Handbook } from "../../../shared/ui/Handbook";
import { useUserStore } from "../../../entities/user/store";
import { Search, ChevronLeft, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

export default function KnowledgeBase() {
  const { language } = useUserStore();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in duration-500 overflow-y-auto h-full px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col gap-2 mt-8 md:mt-0">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-rsg-gold mb-2">
          <div className="w-4 h-1 bg-rsg-gold" />
          System Blueprint
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
          Knowledge Base
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl font-medium">
          Centralized terminal for field operations, installation protocols, and platform education.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-rsg-gold transition-colors" />
        <input 
          type="text"
          placeholder="Search guides, tips, and status codes..."
          className="w-full h-14 bg-surface border-2 border-foreground px-12 text-sm font-bold uppercase tracking-widest focus:outline-none focus:ring-0 focus:border-rsg-gold transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px]"
        />
      </div>

      <Handbook language={language} />

      {/* Footer Support */}
      <div className="mt-12 p-8 border-2 border-dashed border-foreground/20 bg-foreground/[0.02] flex flex-col items-center gap-4 text-center">
        <span className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40">
          Need direct assistance?
        </span>
        <button className="h-12 px-8 border-2 border-foreground font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
          Contact Dev-Ops
        </button>
      </div>
    </div>
  );
}
