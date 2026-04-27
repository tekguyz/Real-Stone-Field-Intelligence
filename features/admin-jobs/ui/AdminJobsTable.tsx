import { Job, JobStatusBadge } from "../../../entities/job";
import { dict } from "../../../entities/i18n/dict";
import {
  MapPin,
  ChevronRight,
  HardHat,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { summarizeJobScope } from "../../../shared/lib/utils";
import { useUserStore } from "../../../entities/user/store";

export function AdminJobsTable({
  jobs,
  isLoading,
  error,
  onJobSelect,
  onUpdateInstaller,
}: {
  jobs: Job[];
  isLoading: boolean;
  error: Error | null;
  onJobSelect: (job: Job) => void;
  onUpdateInstaller: (jobId: string, installerId: string) => void;
}) {
  const { language } = useUserStore();
  const t = dict[language].admin;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-foreground/50 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-rsg-gold" />
        <span className="text-sm font-mono tracking-widest uppercase">
          Loading Work Orders...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-red-500 gap-4">
        <AlertTriangle className="w-8 h-8" />
        <span className="text-sm">Database Sync Error</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Mobile Horizontal Scroll Hint */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden z-10" />
      <div className="overflow-auto max-h-[600px]">
        <table className="w-full text-left text-sm whitespace-nowrap relative">
          <thead className="bg-rsg-surface/90 backdrop-blur-sm text-foreground/60 font-medium border-b border-border sticky top-0 z-20 shadow-sm">
            <tr>
              <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest">
                {t.legacyId}
              </th>
            <th className="px-6 py-4">Client</th>
            <th className="px-6 py-4">Job Scope</th>
            <th className="px-6 py-4">Installer</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest">
              Install Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {jobs.map((job) => (
            <tr
              key={job.id}
              className="hover:bg-rsg-surface/30 transition-colors group cursor-pointer"
              onClick={() => onJobSelect(job)}
            >
              <td className="px-6 py-4 font-mono text-xs text-foreground/50">
                {job.legacy_id}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground/90">
                    {job.client_name}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-foreground/40 font-mono italic uppercase mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {job.community_name || job.address.split(",")[0]}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-foreground/80">
                    {summarizeJobScope(job.stoneapp_parts)}
                  </span>
                  <span className="text-[10px] text-foreground/40 font-mono uppercase">
                    {job.job_type}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                <select
                  className="bg-transparent border border-transparent hover:border-border cursor-pointer text-xs rounded-none px-2 py-1 font-mono uppercase focus:outline-none focus:border-rsg-gold transition-colors text-foreground appearance-none"
                  value={job.installer_id || "unassigned"}
                  onChange={(e) => onUpdateInstaller(job.id, e.target.value)}
                  style={{ WebkitAppearance: "none", MozAppearance: "none" }}
                >
                  <option
                    value="unassigned"
                    className="bg-background text-foreground"
                  >
                    UNASSIGNED
                  </option>
                  <option
                    value="installer_juan"
                    className="bg-background text-foreground"
                  >
                    JUAN
                  </option>
                  <option
                    value="installer_carlos"
                    className="bg-background text-foreground"
                  >
                    CARLOS
                  </option>
                </select>
              </td>
              <td className="px-6 py-4">
                <JobStatusBadge status={job.status} />
              </td>
              <td className="px-6 py-4">
                {job.scheduled_arrival || job.scheduled_date ? (
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground/90 text-sm">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                      }).format(
                        new Date(
                          job.scheduled_arrival || job.scheduled_date || "",
                        ),
                      )}
                    </span>
                    <span className="text-[10px] text-foreground/60 font-mono uppercase">
                      {new Intl.DateTimeFormat("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      }).format(
                        new Date(
                          job.scheduled_arrival || job.scheduled_date || "",
                        ),
                      )}
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] text-foreground/40 font-mono italic uppercase">
                    TBD
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {jobs.length === 0 && (
        <div className="p-8 text-center text-foreground/50 text-sm">
          No matching work orders found.
        </div>
      )}
      </div>
    </div>
  );
}
