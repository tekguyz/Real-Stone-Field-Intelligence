import { ArrowLeft } from "lucide-react";
import { SyncIndicator } from "../../../shared/ui/SyncIndicator";

export function FieldJobDetailHeader({ language, handleBackNavigation }: { language: "en" | "es", handleBackNavigation: any }) {
  return (
    <div className="h-14 px-4 bg-background border-b border-border sticky top-0 z-20 flex justify-between items-center shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={handleBackNavigation}
          className="text-foreground/50 hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-mono text-xs text-foreground/40 uppercase tracking-[0.2em] font-bold">
          {language === "en" ? "Job Details" : "Detalles"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <SyncIndicator />
      </div>
    </div>
  );
}
