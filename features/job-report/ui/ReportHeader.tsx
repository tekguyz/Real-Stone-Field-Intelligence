"use client";

import { Job } from "../../../entities/job/types";
import { CheckCircle2 } from "lucide-react";
import { useUserStore } from "../../../entities/user/store";
import { dict } from "../../../entities/i18n/dict";
import { StatusBadge } from "../../../components/ui/StatusBadge";

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
    <div className="border-b border-border print:border-black p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden bg-card print:bg-white">
      <div className="flex flex-col z-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground print:text-black break-words leading-none uppercase">
          {job.client_name}
        </h1>
        <div className="mt-2 font-mono text-muted-foreground print:text-foreground text-sm tracking-widest uppercase mb-1">
          {headerWoId}
        </div>
      </div>

      <div className="z-10 flex flex-col items-start md:items-end text-left md:text-right">
        <div className="flex items-center gap-2">
          <StatusBadge status="Verified" className="px-3 py-1.5" />
        </div>
        <span className="text-xs font-medium mt-2 text-muted-foreground print:text-foreground uppercase tracking-widest">
          {job.updated_at ? formatHumanDateTime(job.updated_at, language) : "N/A"}
        </span>
      </div>
    </div>
  );
}