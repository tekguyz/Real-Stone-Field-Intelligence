import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function FieldJobDetailError({ language, t }: { language: string, t: any }) {
  return (
    <div className="flex flex-col min-h-screen bg-background field-rugged">
      <div className="h-12 px-4 bg-background sticky top-0 z-20 flex items-center border-b border-border">
        <Link href="/field" className="rugged-button-sm p-1.5 bg-surface text-foreground flex items-center justify-center">
          <ArrowLeft className="w-4 h-4" strokeWidth={3} />
        </Link>
      </div>
      
      <div className="p-6 flex flex-col items-center justify-center grow text-center">
        <div className="rugged-card bg-foreground/5 border-dashed flex flex-col items-center gap-4 py-12 px-6">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 flex items-center justify-center border-2 border-red-500">
            <span className="font-black text-2xl">?</span>
          </div>
          <h1 className="text-xl font-black text-foreground uppercase tracking-widest">
            {language === "es" ? "TRABAJO NO ENCONTRADO" : "JOB NOT FOUND"}
          </h1>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] max-w-[200px]">
            {language === "es" ? "EL REGISTRO SOLICITADO NO EXISTE O NO ESTÁ ASIGNADO." : "THE REQUESTED RECORD DOES NOT EXIST OR IS NOT ASSIGNED."}
          </p>
        </div>
      </div>
    </div>
  );
}
