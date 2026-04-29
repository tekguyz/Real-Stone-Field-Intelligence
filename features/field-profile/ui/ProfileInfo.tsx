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

      <section className="rugged-card relative group p-4!">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-rsg-gold" />
        <div className="flex justify-between items-center mb-3 pl-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-foreground/40" />
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">
              {t.accessPin}
            </span>
          </div>
          <button
            onClick={() => setShowPin(!showPin)}
            className="p-1 px-3 bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors"
          >
            {showPin ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="bg-foreground/5 p-3 flex items-center justify-center ml-3">
          <span
            className={`font-mono text-xl tracking-[0.5em] font-black ${showPin ? "text-rsg-gold" : "text-foreground/20"}`}
          >
            {showPin ? "4 4 5 2" : "• • • •"}
          </span>
        </div>
      </section>
    </>
  );
}
