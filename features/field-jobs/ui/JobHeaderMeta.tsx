import { Job } from "../../../entities/job/types";
import { MapPin, Clock } from "lucide-react";

export function JobBlockSite({
  job,
  language,
}: {
  job: Job;
  language: "en" | "es";
}) {
  const community = job.community_name ? job.community_name.toUpperCase() : "";

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em]">
        {language === "en" ? "Project Site" : "Sitio del Proyecto"}
      </h3>
      <div className="flex flex-col gap-2 p-3 sm:p-4 border border-border dark:border-primary/60 bg-surface/30">
        <button
          onClick={() => {
            const query = encodeURIComponent(job.address);
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${query}`,
              "_blank",
            );
          }}
          className="flex items-center gap-2 text-left hover:opacity-80 transition-opacity"
        >
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <p className="font-medium text-sm text-foreground leading-tight underline decoration-foreground/20 underline-offset-2">
            {job.address} {community ? `• ${community}` : ""}
          </p>
        </button>
        {job.logistics_notes && (
          <p className="text-sm font-medium text-muted-foreground mt-1">
            <span className="font-bold mr-1">
              Logistics:
            </span>
            {job.logistics_notes}
          </p>
        )}
      </div>
    </div>
  );
}

export function JobBlockArrival({
  scheduledDate,
  language,
}: {
  scheduledDate: string | null;
  language: "en" | "es";
}) {
  let timeStr = "WAITING TO BE ROUTED";
  if (scheduledDate) {
    try {
      const d = new Date(scheduledDate);
      timeStr = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
        .format(d)
        .toUpperCase();
    } catch {}
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.2em]">
        {language === "en" ? "Scheduled Arrival" : "Llegada Programada"}
      </h3>
      <div className="flex items-center gap-2 p-3 sm:p-4 border border-border dark:border-primary/60 bg-surface/30">
        <Clock className="w-4 h-4 text-primary shrink-0" />
        <p className="font-medium text-sm text-foreground leading-tight">
          {timeStr}
        </p>
      </div>
    </div>
  );
}
