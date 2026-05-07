import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "../../../components/ui/StatusBadge";

export function FieldJobDetailHeader({ language, handleBackNavigation, status }: { language: "en" | "es", handleBackNavigation: any, status?: string }) {
  return (
    <div className="h-12 px-4 bg-background sticky top-0 z-20 flex justify-between items-center shrink-0 border-b border-border">
      <div className="flex items-center gap-3">
        <button
          onClick={handleBackNavigation}
          className="rugged-button-sm p-1.5 bg-surface text-foreground"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={3} />
        </button>
        <span className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest font-black hidden sm:inline-block">
          {language === "en" ? "Job Details" : "Detalles"}
        </span>
      </div>
      {status && (
        <div className="flex items-center">
          <StatusBadge status={status} variant="rugged" className="px-1.5 py-0.5 text-[10px] font-bold tracking-widest" />
        </div>
      )}
    </div>
  );
}
