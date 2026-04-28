import { Phone, AlertTriangle, ChevronRight } from "lucide-react";
import { dict } from "../../../entities/i18n/dict";
import { motion } from "motion/react";
import { ReportIssueForm } from "../../../shared/ui/ReportIssueForm";

export function ProfileSupport({ language, showReportForm, setShowReportForm, activeRole, fullName }: { language: "en" | "es", showReportForm: boolean, setShowReportForm: any, activeRole: string, fullName: string }) {
  const t = dict[language].field;

  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em] mb-1">
        {t.help}
      </h3>

      <div className="flex flex-col border border-border divide-y divide-border">
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
