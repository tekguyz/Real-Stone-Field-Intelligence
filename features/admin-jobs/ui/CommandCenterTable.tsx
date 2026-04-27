import { Job, JobStatusBadge } from "../../../entities/job";
import { dict } from "../../../entities/i18n/dict";
import {
  ChevronRight,
  Loader2,
  AlertTriangle,
  TrendingUp,
  Clock,
  AlertCircle,
  PlayCircle,
  CheckCircle2,
  MapPin,
  ArrowUpDown,
} from "lucide-react";
import { summarizeJobScope } from "../../../shared/lib/utils";
import { useUserStore } from "../../../entities/user/store";

const SortIcon = ({ 
  columnKey, 
  onSort, 
  sortConfig 
}: { 
  columnKey: string;
  onSort?: (key: any) => void;
  sortConfig?: { key: string; direction: "asc" | "desc" };
}) => {
  if (!onSort || !sortConfig) return null;
  const isActive = sortConfig.key === columnKey;
  return (
    <ArrowUpDown className={`w-3 h-3 ml-1 transition-colors ${isActive ? "text-rsg-gold" : "text-foreground/20"}`} />
  );
};

export function CommandCenterTable({
  jobs,
  isLoading,
  error,
  onJobSelect,
  onSort,
  sortConfig,
}: {
  jobs: Job[];
  isLoading: boolean;
  error: Error | null;
  onJobSelect: (job: Job) => void;
  onSort?: (key: "legacy_id" | "client_name" | "scheduled_arrival") => void;
  sortConfig?: { key: string; direction: "asc" | "desc" };
}) {
  const { language } = useUserStore();
  const t = dict[language].admin;

  return (
    <div className="bg-card border border-border min-h-[400px]">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-foreground/50 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-rsg-gold" />
          <span className="text-sm font-mono tracking-widest uppercase">
            {t.syncingPipeline}
          </span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-red-500 gap-4">
          <AlertTriangle className="w-8 h-8" />
          <span className="text-sm">{t.databaseSyncError}</span>
        </div>
      ) : (
        <div className="relative">
          {/* Mobile Horizontal Scroll Hint */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden z-10" />
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full text-left text-sm whitespace-nowrap relative">
              <thead className="bg-rsg-surface/90 backdrop-blur-sm text-foreground/60 font-medium border-b border-border sticky top-0 z-20 shadow-sm">
                <tr>
                  <th 
                    className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => onSort?.("legacy_id")}
                  >
                    <div className="flex items-center">
                      {t.legacyId}
                      <SortIcon columnKey="legacy_id" onSort={onSort} sortConfig={sortConfig} />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => onSort?.("client_name")}
                  >
                    <div className="flex items-center">
                      {t.client}
                      <SortIcon columnKey="client_name" onSort={onSort} sortConfig={sortConfig} />
                    </div>
                  </th>
                  <th className="px-6 py-4">{t.scope}</th>
                  <th className="px-6 py-4">{t.installer}</th>
                  <th className="px-6 py-4">{t.status}</th>
                  <th 
                    className="px-6 py-4 cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => onSort?.("scheduled_arrival")}
                  >
                    <div className="flex items-center">
                      {t.installDate}
                      <SortIcon columnKey="scheduled_arrival" onSort={onSort} sortConfig={sortConfig} />
                    </div>
                  </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-rsg-surface/30 transition-colors cursor-pointer group"
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
                    <div className="flex flex-col text-foreground/80">
                      <span className="font-semibold">
                        {summarizeJobScope(job.stoneapp_parts)}
                      </span>
                      <span className="text-[10px] text-foreground/40 font-mono uppercase">
                        {job.job_type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground/80 font-semibold uppercase font-mono text-[10px] tracking-widest">
                    {job.installer_id ? job.installer_id.replace('installer_', '').toUpperCase() : t.unassigned}
                  </td>
                  <td className="px-6 py-4">
                    <JobStatusBadge status={job.status} />
                  </td>
                  <td className="px-6 py-4">
                    {job.scheduled_arrival || job.scheduled_date ? (
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground/90 text-sm">
                          {new Intl.DateTimeFormat(language === "es" ? "es-ES" : "en-US", {
                            month: "short",
                            day: "numeric",
                          }).format(
                            new Date(
                              job.scheduled_arrival || job.scheduled_date || "",
                            ),
                          )}
                        </span>
                        <span className="text-[10px] text-foreground/60 font-mono uppercase">
                          {new Intl.DateTimeFormat(language === "es" ? "es-ES" : "en-US", {
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
              {t.noActiveWorkOrders}
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
}
