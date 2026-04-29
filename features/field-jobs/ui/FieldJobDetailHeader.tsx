import { ArrowLeft } from "lucide-react";

export function FieldJobDetailHeader({ language, handleBackNavigation }: { language: "en" | "es", handleBackNavigation: any }) {
  return (
    <div className="h-16 px-4 bg-background sticky top-0 z-20 flex justify-between items-center shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={handleBackNavigation}
          className="rugged-button-sm p-1.5 bg-surface text-foreground"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={3} />
        </button>
        <span className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest font-black">
          {language === "en" ? "Job Details" : "Detalles"}
        </span>
      </div>
    </div>
  );
}
