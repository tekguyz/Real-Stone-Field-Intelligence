import { Job } from "../../../entities/job";
import { dict } from "../../../entities/i18n/dict";
import {
  Loader2,
  AlertTriangle,
  MapPin,
  ArrowUpDown,
} from "lucide-react";
import { summarizeJobScope } from "../../../shared/lib/utils";
import { useUserStore } from "../../../entities/user/store";
import { useSortableTable } from "../../../shared/lib/useSortableTable";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { JOB_STATUSES } from "@/lib/constants/statuses";

const SortIcon = ({ 
  columnKey, 
  sortConfig 
}: { 
  columnKey: string;
  sortConfig: { key: any; direction: "asc" | "desc" | null };
}) => {
  const isActive = sortConfig.key === columnKey;
  return (
    <ArrowUpDown className={`w-3 h-3 ml-2 transition-colors ${isActive && sortConfig.direction ? "text-rsg-gold" : "text-foreground/10"}`} />
  );
};

export function CommandCenterTable({
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

  const { sortedData, sortConfig, handleSort } = useSortableTable(jobs, "commandCenter", { key: "scheduled_arrival", direction: "desc" });

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
        <table className="w-full text-left text-sm whitespace-nowrap relative border-separate border-spacing-0">
          <thead className="bg-surface sticky top-0 z-20 shadow-sm border-b border-border">
            <tr>
              <th 
                className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors border-b border-border"
                onClick={() => handleSort("legacy_id")}
              >
                <div className="flex items-center">
                  {t.legacyId}
                  <SortIcon columnKey="legacy_id" sortConfig={sortConfig} />
                </div>
              </th>
              <th 
                className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors border-b border-border"
                onClick={() => handleSort("client_name")}
              >
                <div className="flex items-center">
                  {t.client}
                  <SortIcon columnKey="client_name" sortConfig={sortConfig} />
                </div>
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left border-b border-border">{t.scope}</th>
              <th 
                className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors border-b border-border"
                onClick={() => handleSort("installer_id")}
              >
                <div className="flex items-center">
                  {t.installer}
                  <SortIcon columnKey="installer_id" sortConfig={sortConfig} />
                </div>
              </th>
              <th 
                className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors border-b border-border"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  {t.status}
                  <SortIcon columnKey="status" sortConfig={sortConfig} />
                </div>
              </th>
              <th 
                className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors border-b border-border"
                onClick={() => handleSort("scheduled_arrival")}
              >
                <div className="flex items-center">
                  {t.installDate}
                  <SortIcon columnKey="scheduled_arrival" sortConfig={sortConfig} />
                </div>
              </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {sortedData.map((job) => {
            const isAssignmentLocked =
              job.status === JOB_STATUSES.ACTIVE ||
              job.status === JOB_STATUSES.REVIEW ||
              job.status === JOB_STATUSES.VERIFIED;
            return (
              <tr
                key={job.id}
                className="hover:bg-primary/5 transition-colors cursor-pointer group"
                onClick={() => onJobSelect(job)}
              >
                <td className="p-4 text-sm font-medium text-foreground">
                  {job.legacy_id}
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {job.client_name}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground uppercase mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {job.community_name || job.address.split(",")[0]}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {summarizeJobScope(job.stoneapp_parts)}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase">
                      {job.job_type}
                    </span>
                  </div>
                </td>
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <select
                    className={`bg-transparent border border-transparent hover:border-border cursor-pointer text-sm font-medium text-foreground rounded-none px-0 py-0 uppercase focus:outline-none focus:border-primary/30 transition-colors appearance-none ${isAssignmentLocked ? "opacity-40 cursor-not-allowed" : ""}`}
                    value={job.installer_id || "unassigned"}
                    onChange={(e) => onUpdateInstaller(job.id, e.target.value)}
                    disabled={isAssignmentLocked}
                    style={{ WebkitAppearance: "none", MozAppearance: "none" }}
                  >
                    <option value="unassigned">{t.unassigned}</option>
                    <option value="installer_juan">JUAN</option>
                    <option value="installer_carlos">CARLOS</option>
                  </select>
                </td>
                <td className="p-4">
                  <StatusBadge status={job.status} />
                </td>
                <td className="p-4">
                  {job.scheduled_arrival || job.scheduled_date ? (
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {new Intl.DateTimeFormat(language === "es" ? "es-ES" : "en-US", {
                          month: "short",
                          day: "numeric",
                        }).format(
                          new Date(
                            job.scheduled_arrival || job.scheduled_date || "",
                          ),
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase">
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
                    <span className="text-xs text-muted-foreground italic uppercase">
                      TBD
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
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
