"use client";

import { Job } from "../../../entities/job/types";
import { useUserStore } from "../../../entities/user/store";
import { dict } from "../../../entities/i18n/dict";
import { formatInstallerName } from "../../../shared/lib/utils";

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

interface ReportStatsGridProps {
  job: Job;
  avgAccuracy: string;
}

export function ReportStatsGrid({ job, avgAccuracy }: ReportStatsGridProps) {
  const { language } = useUserStore();
  const t = dict[language].admin;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b border-border print:border-black divide-border print:divide-black">
      {/* Column 1: Logistics */}
      <div className="p-6 flex flex-col gap-4 bg-surface print:bg-white">
        <h3 className="font-semibold uppercase tracking-widest text-xs border-b border-border print:border-black/20 pb-2">
          {t.logistics}
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs font-semibold text-muted-foreground print:text-foreground uppercase tracking-widest block mb-1">
              {language === "es" ? "Nombre Instalador" : "Installer Name"}
            </span>
            <span className="font-medium text-sm text-foreground uppercase">
              {formatInstallerName(job.installer_id)}
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground print:text-foreground uppercase tracking-widest block mb-1">
              {t.arrivalTime}
            </span>
            <span className="font-medium text-sm text-foreground uppercase">
              {job.scheduled_arrival
                ? formatHumanDateTime(job.scheduled_arrival, language)
                : "N/A"}
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground print:text-foreground uppercase tracking-widest block mb-1">
              {language === "es" ? "Hora de Finalización" : "Completion Time"}
            </span>
            <span className="font-medium text-sm text-foreground uppercase">
              {job.updated_at ? formatHumanDateTime(job.updated_at, language) : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Column 2: Location */}
      <div className="p-6 flex flex-col gap-4 bg-surface print:bg-white">
        <h3 className="font-semibold uppercase tracking-widest text-xs border-b border-border print:border-black/20 pb-2">
          {t.location}
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs font-semibold text-muted-foreground print:text-foreground uppercase tracking-widest block mb-1">
              {language === "es" ? "Dirección Completa" : "Full Address"}
            </span>
            <span className="font-medium text-sm text-foreground uppercase break-words block leading-snug">
              {job.address}
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground print:text-foreground uppercase tracking-widest block mb-1">
              {language === "es" ? "Comunidad / Lote" : "Community / Lot"}
            </span>
            <span className="font-medium text-sm text-foreground uppercase break-words block">
              {job.community_name || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground print:text-foreground uppercase tracking-widest block mb-1">
              {language === "es" ? "Precisión de GPS" : "GPS Accuracy Rating"}
            </span>
            <span className="font-medium text-sm text-foreground uppercase block">
              {avgAccuracy}
            </span>
          </div>
        </div>
      </div>

      {/* Column 3: Scope */}
      <div className="p-6 flex flex-col gap-4 bg-surface print:bg-white">
        <h3 className="font-semibold uppercase tracking-widest text-xs border-b border-border print:border-black/20 pb-2">
          {t.jobScope}
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs font-semibold text-muted-foreground print:text-foreground uppercase tracking-widest block mb-1">
              {language === "es" ? "Tipo de Trabajo" : "Job Type"}
            </span>
            <span className="font-medium text-sm text-foreground uppercase">{job.job_type}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground print:text-foreground uppercase tracking-widest block mb-1">
              {t.jobScope}
            </span>
            <div className="flex flex-col gap-2 mt-1 break-words">
              {job.stoneapp_parts && job.stoneapp_parts.length > 0 ? (
                job.stoneapp_parts.map((part: any, i: number) => (
                  <span
                    key={i}
                    className="text-xs font-mono bg-border/20 print:bg-black/5 px-2 py-1 rounded"
                  >
                    {part.qty}x {part.material}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground print:text-foreground italic">
                  {t.noScopeData}
                </span>
              )}
              {job.logistics_notes && (
                <span className="text-xs mt-2">
                  <span className="font-semibold">{language === "es" ? "Notas" : "Notes"}:</span> {job.logistics_notes}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
