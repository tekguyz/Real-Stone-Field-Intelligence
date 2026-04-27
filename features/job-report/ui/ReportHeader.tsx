"use client";

import { Job } from "../../../entities/job/types";
import { CheckCircle2 } from "lucide-react";
import { useUserStore } from "../../../entities/user/store";
import { dict } from "../../../entities/i18n/dict";

const formatHumanDateTime = (dateStr: string | number, language: string) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  const locale = language === "es" ? "es-ES" : "en-US";
  const datePart = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(d);
  const timePart = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
  return `${datePart} • ${timePart}`;
};

interface ReportHeaderProps {
  job: Job;
  headerWoId: string;
}

export function ReportHeader({ job, headerWoId }: ReportHeaderProps) {
  const { language } = useUserStore();
  const t = dict[language];

  return (
    <div className="border-b-4 border-foreground print:border-black p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
      <div className="flex flex-col z-10">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground print:text-black break-words">
          {job.client_name}
        </h1>
        <div className="mt-2 font-mono text-rsg-gold font-bold text-lg tracking-widest">
          {headerWoId}
        </div>
      </div>

      <div className="z-10 flex flex-col items-end text-right">
        <div className="flex items-center gap-2 bg-status-verified-bg text-status-verified-text print:bg-black print:text-white px-4 py-2 border-2 border-status-verified-bg print:border-black">
          <CheckCircle2 className="w-5 h-5 text-status-verified-text print:text-white" />
          <span className="font-black uppercase tracking-[0.2em] text-sm">
            {t.status.verified}
          </span>
        </div>
        <span className="text-[10px] font-mono mt-2 text-foreground/60 print:text-black/60 uppercase">
          {job.updated_at ? formatHumanDateTime(job.updated_at, language) : "N/A"}
        </span>
      </div>

      <div className="absolute -right-8 -top-8 text-foreground/5 print:text-black/5 rotate-12 pointer-events-none select-none">
        <CheckCircle2 className="w-64 h-64" />
      </div>
    </div>
  );
}