import { dict } from "../../../entities/i18n/dict";
import { useUserStore } from "../../../entities/user/store";
import { JOB_STATUSES } from "../../../lib/constants/statuses";
import { AlertTriangle } from "lucide-react";
import { summarizeJobScope } from "../../../shared/lib/utils";
import { Job } from "../../../entities/job/types";

interface CommandCenterAlertsProps {
  currentJobs: Job[];
  stats: {
    review: number;
    [key: string]: number;
  };
  isLoading: boolean;
  onJobSelect: (job: Job) => void;
}

export function CommandCenterAlerts({ currentJobs, stats, isLoading, onJobSelect }: CommandCenterAlertsProps) {
  const { language } = useUserStore();
  const t = dict[language].admin;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-medium tracking-tight tracking-tighter uppercase font-mono text-[10px] text-foreground/40">{t.alerts}</h2>
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-primary/5 animate-pulse h-20 border border-border"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {currentJobs
            .filter((j) => j.status === JOB_STATUSES.REVIEW)
            .slice(0, 3)
            .map((job) => (
              <div
                key={`alert-${job.id}`}
                onClick={() => onJobSelect(job)}
                className="bg-card border border-border p-4 border-l-2 border-l-rsg-warning cursor-pointer hover:bg-surface transition-colors group relative rounded-md shadow-sm"
              >
                <div className="flex items-center gap-2 text-rsg-warning mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest leading-none">
                    {t.systemAlert}
                  </span>
                </div>
                <p className="text-sm font-semibold group-hover:text-primary transition-colors leading-tight">
                  {job.client_name}
                </p>
                <p className="text-xs font-mono text-muted-foreground mt-1 uppercase leading-snug truncate">
                  {job.legacy_id} •{" "}
                  {summarizeJobScope(job.stoneapp_parts)}
                </p>
              </div>
            ))}
          {stats.review === 0 && (
            <div className="p-4 border border-dashed border-border text-center">
              <p className="text-xs text-foreground/50">
                {t.noPriorityAlerts}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
