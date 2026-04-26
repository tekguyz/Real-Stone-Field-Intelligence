"use client";

import { Job } from "../../../entities/job/types";

const formatHumanDateTime = (dateStr: string | number) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  const datePart = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(d);
  const timePart = new Intl.DateTimeFormat("en-US", {
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 border-b-4 border-foreground print:border-black divide-foreground print:divide-black">
      {/* Column 1: Logistics */}
      <div className="bento-card p-6 flex flex-col gap-4 bg-surface print:bg-white">
        <h3 className="font-black uppercase tracking-widest text-xs border-b border-border print:border-black/20 pb-2">
          Logistics
        </h3>
        <div className="flex flex-col gap-3">
          <div>
            <span className="text-[10px] font-mono text-foreground/60 print:text-black/60 uppercase block">
              Installer Name
            </span>
            <span className="font-bold text-sm uppercase">
              {job.installer_id
                ? job.installer_id.replace("installer_", "")
                : "UNASSIGNED"}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-foreground/60 print:text-black/60 uppercase block">
              Arrival Time
            </span>
            <span className="font-bold text-sm uppercase">
              {job.scheduled_arrival
                ? formatHumanDateTime(job.scheduled_arrival)
                : "N/A"}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-foreground/60 print:text-black/60 uppercase block">
              Completion Time
            </span>
            <span className="font-bold text-sm uppercase">
              {job.updated_at ? formatHumanDateTime(job.updated_at) : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Column 2: Location */}
      <div className="bento-card p-6 flex flex-col gap-4 bg-surface print:bg-white">
        <h3 className="font-black uppercase tracking-widest text-xs border-b border-border print:border-black/20 pb-2">
          Location
        </h3>
        <div className="flex flex-col gap-3">
          <div>
            <span className="text-[10px] font-mono text-foreground/60 print:text-black/60 uppercase block">
              Full Address
            </span>
            <span className="font-bold text-sm uppercase break-words block leading-snug">
              {job.address}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-foreground/60 print:text-black/60 uppercase block">
              Community / Lot
            </span>
            <span className="font-bold text-sm uppercase break-words block">
              {job.community_name || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-foreground/60 print:text-black/60 uppercase block">
              GPS Accuracy Rating
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
          Scope of Work
        </h3>
        <div className="flex flex-col gap-3">
          <div>
            <span className="text-[10px] font-mono text-foreground/60 print:text-black/60 uppercase block">
              Job Type
            </span>
            <span className="font-bold text-sm uppercase">{job.job_type}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-foreground/60 print:text-black/60 uppercase block">
              Summarized Scope
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
                  No detailed scope attached.
                </span>
              )}
              {job.logistics_notes && (
                <span className="text-xs font-mono mt-2">
                  Notes: {job.logistics_notes}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
