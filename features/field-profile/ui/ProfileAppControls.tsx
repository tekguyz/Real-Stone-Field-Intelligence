import { ChevronRight } from "lucide-react";

export function ProfileAppControls({ language }: { language: "en" | "es" }) {
  return (
    <section className="grid grid-cols-1 gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em]">
          {language === "es" ? "Control de Aplicación" : "Application Control"}
        </h3>
        <div className="flex flex-col border border-border divide-y divide-border">
          <div className="flex items-center justify-between p-4 bg-surface">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                {language === "es" ? "Almacenaje Offline" : "Offline Storage"}
              </span>
              <span className="text-[8px] font-mono text-foreground/40 uppercase">
                {language === "es" ? "12 sincronizaciones pendientes" : "12 pending syncs"}
              </span>
            </div>
            <button className="text-[8px] font-black uppercase tracking-[0.2em] bg-foreground text-background px-3 py-1.5 active:scale-95 transition-transform">
              {language === "es" ? "Sincronizar" : "Sync Now"}
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-surface">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                {language === "es" ? "Calidad de Medios" : "Media Quality"}
              </span>
              <span className="text-[8px] font-mono text-foreground/40 uppercase">
                {language === "es" ? "Estándar (Equilibrado)" : "Standard (Balanced)"}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-foreground/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
