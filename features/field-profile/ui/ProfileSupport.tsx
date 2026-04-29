import { Phone, AlertTriangle, ChevronRight, BookOpen, X } from "lucide-react";
import { dict } from "../../../entities/i18n/dict";
import { motion, AnimatePresence } from "motion/react";
import { ReportIssueForm } from "../../../shared/ui/ReportIssueForm";
import { Drawer } from "vaul";
import { Handbook } from "../../../shared/ui/Handbook";

export function ProfileSupport({ language, showReportForm, setShowReportForm, activeRole, fullName }: { language: "en" | "es", showReportForm: boolean, setShowReportForm: any, activeRole: string, fullName: string }) {
  const t = dict[language].field;

  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mb-1">
        {t.help}
      </h3>

      <div className="flex flex-col border border-border divide-y divide-border">
        {/* Field Guide - Handbook Toggle */}
        <Drawer.Root shouldScaleBackground>
          <Drawer.Trigger asChild>
            <button
              className="w-full h-14 bg-surface flex items-center justify-between px-4 active:bg-foreground/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-rsg-gold" />
                <span className="text-xs font-black uppercase tracking-[0.1em] text-foreground/80">
                  {language === "es" ? "Guía de Campo" : "Field Guide"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] px-1.5 py-0.5 bg-rsg-gold/10 text-rsg-gold border border-rsg-gold/20">
                  {language === "es" ? "NUEVO" : "NEW"}
                </span>
                <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground/40 transition-colors" />
              </div>
            </button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]" />
            <Drawer.Content className="bg-background flex flex-col h-full fixed bottom-0 left-0 right-0 z-[101] border-t-4 border-foreground outline-none">
              <div className="flex flex-col flex-1 h-full relative overflow-y-auto custom-scrollbar">
                {/* Header / Top Bar */}
                <div className="sticky top-0 z-10 bg-background border-b-2 border-foreground px-6 py-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <Drawer.Title className="text-xl font-black uppercase tracking-tight">
                      {language === "es" ? "Manual de Campo" : "Field Handbook"}
                    </Drawer.Title>
                    <Drawer.Description className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest font-bold">
                      SYSTEM BLUEPRINT — v1.0.4
                    </Drawer.Description>
                  </div>
                  <Drawer.Close asChild>
                    <button className="h-10 px-4 border-2 border-foreground bg-foreground text-background font-black text-xs uppercase tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]">
                      {language === "es" ? "CERRAR" : "CLOSE"}
                    </button>
                  </Drawer.Close>
                </div>

                <div className="p-6 max-w-2xl mx-auto w-full">
                  <Handbook language={language} />
                  
                  {/* Footer Support in Drawer */}
                  <div className="mt-12 p-8 border-2 border-dashed border-foreground/20 bg-foreground/[0.02] flex flex-col items-center gap-4 text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
                      Still having issues?
                    </span>
                    <a href="tel:7724899964" className="h-12 px-8 border-2 border-foreground font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.1)] flex items-center justify-center">
                      Call Office
                    </a>
                  </div>
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>

        <a
          href="tel:7724899964"
          className="w-full h-14 bg-surface flex items-center justify-between px-4 active:bg-foreground/5 transition-all group"
        >
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-foreground/80">
              (772) 489-9964
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
            {t.callOffice}
          </span>
        </a>

        <button
          onClick={() => setShowReportForm(!showReportForm)}
          className={`w-full h-14 flex items-center justify-between px-4 active:bg-foreground/5 transition-all group ${showReportForm ? "bg-rsg-gold/5" : "bg-surface"}`}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle
              className={`w-4 h-4 ${showReportForm ? "text-rsg-gold" : "text-amber-500"}`}
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/80">
              {t.reportIssue}
            </span>
          </div>
          <ChevronRight
            className={`w-4 h-4 transition-transform ${showReportForm ? "rotate-90 text-rsg-gold" : "text-foreground/20"}`}
          />
        </button>
      </div>

      {showReportForm && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-x border-b border-border"
        >
          <ReportIssueForm userRole={activeRole} userName={fullName} />
        </motion.div>
      )}
    </section>
  );
}
