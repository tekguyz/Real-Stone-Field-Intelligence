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
    <div className="grid grid-cols-1 md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 border-b-4 border-foreground print:border-black divide-foreground print:divide-black">
      {/* Column 1: Logistics */}
      <div className="bento-card p-6 flex flex-col gap-4 bg-surface print:bg-white">
        <h3 className="font-black uppercase tracking-widest text-xs border-b border-border print:border-black/20 pb-2">
          {t.logistics}
        </h3>
        <div className="flex flex-col gap-3">
          <div>
            <span className="text-[10px] font-mono text-foreground/60 print:text-black/60 uppercase block">
              {language === "es" ? "Nombre Instalador" : "Installer Name"}
            </span>
            <span className="font-bold text-sm uppercase">
              {formatInstallerName(job.installer_id)}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-foreground/60 print:text-black/60 uppercase block">
              {t.arrivalTime}
            </span>
            <span className="font-bold text-sm uppercase">
              {job.scheduled_arrival
                ? formatHumanDateTime(job.scheduled_arrival, language)
                : "N/A"}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-foreground/60 print:text-black/60 uppercase block">
              {language === "es" ? "Hora de Finalización" : "Completion Time"}
            </span>
            <span className="font-bold text-sm uppercase">
              {job.updated_at ? formatHumanDateTime(job.updated_at, language) : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Column 2: Location */}
      <div className="bento-card p-6 flex flex-col gap-4 bg-surface print:bg-white">
        <h3 className="font-black uppercase tracking-widest text-xs border-b border-border print:border-black/20 pb-2">
          {t.location}
        </h3>
        <div className="flex flex-col gap-3">
          <div>
            <span className="text-[10px] font-mono text-foreground/60 print:text-black/60 uppercase block">
              {language === "es" ? "Dirección Completa" : "Full Address"}
            </span>
            <span className="font-bold text-sm uppercase break-words block leading-snug">
              {job.address}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-foreground/60 print:text-black/60 uppercase block">
              {language === "es" ? "Comunidad / Lote" : "Community / Lot"}
            </span>
            <span className="font-bold text-sm uppercase break-words block">
              {job.community_name || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-foreground/60 print:text-black/60 uppercase block">
              {language === "es" ? "Precisión de GPS" : "GPS Accuracy Rating"}
            </span>
            <span className="font-bold text-sm uppercase block">
              {avgAccuracy}
            </span>
          </div>
        </div>
      </div>

      {/* Column 3: Scope */}
      <div className="bento-card p-6 flex flex-col gap-4 bg-surface print:bg-white">
        <h3 className="font-black uppercase tracking-widest text-xs border-b border-border print:border-black/20 pb-2">
          {t.jobScope}
        </h3>
        <div className="flex flex-col gap-3">
          <div>
            <span className="text-[10px] font-mono text-foreground/60 print:text-black/60 uppercase block">
              {language === "es" ? "Tipo de Trabajo" : "Job Type"}
            </span>
            <span className="font-bold text-sm uppercase">{job.job_type}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-foreground/60 print:text-black/60 uppercase block">
              {t.jobScope}
            </span>
            <div className="flex flex-col gap-1 mt-1 break-words">
              {job.stoneapp_parts && job.stoneapp_parts.length > 0 ? (
                job.stoneapp_parts.map((part: any, i: number) => (
                  <span
                    key={i}
                    className="text-xs font-mono bg-border/20 print:bg-black/5 px-2 py-1"
                  >
                    {part.qty}x {part.material}
                  </span>
                ))
              ) : (
                <span className="text-xs font-mono text-foreground/40 italic">
                  {t.noScopeData}
                </span>
              )}
              {job.logistics_notes && (
                <span className="text-xs font-mono mt-2">
                  {language === "es" ? "Notas" : "Notes"}: {job.logistics_notes}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
