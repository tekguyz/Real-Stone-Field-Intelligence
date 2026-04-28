import { Lock, EyeOff, Eye } from "lucide-react";
import { dict } from "../../../entities/i18n/dict";

export function ProfileInfo({ fullName, initials, showPin, setShowPin, language }: { fullName: string, initials: string, showPin: boolean, setShowPin: (v: boolean) => void, language: "en" | "es" }) {
  const t = dict[language].field;
  
  return (
    <>
      <div className="flex flex-col mb-2">
        <h2 className="text-2xl font-black text-foreground tracking-tight uppercase leading-none">
          {fullName}
        </h2>
        <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mt-1">
          ID: 884-29
        </span>
      </div>

      <section className="bg-surface border border-border p-4 relative group">
        <div className="absolute top-0 left-0 w-1 h-full bg-foreground/30 group-hover:bg-primary transition-colors" />
        <div className="flex justify-between items-center mb-3 pl-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-foreground/40" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">
              {t.accessPin}
            </span>
          </div>
          <button
            onClick={() => setShowPin(!showPin)}
            className="p-2 text-foreground/40 hover:text-primary transition-colors"
          >
            {showPin ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="bg-foreground/[0.02] border border-border p-3 flex items-center justify-center ml-3 group-hover:bg-primary/[0.02] transition-colors">
          <span
            className={`font-mono text-lg tracking-[0.5em] font-black ${showPin ? "text-primary" : "text-foreground/20"}`}
          >
            {showPin ? "4 4 5 2" : "• • • •"}
          </span>
        </div>
      </section>
    </>
  );
}
