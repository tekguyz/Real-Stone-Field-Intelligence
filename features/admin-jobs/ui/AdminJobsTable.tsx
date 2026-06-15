import { Job } from "../../../entities/job";
import { dict } from "../../../entities/i18n/dict";
import {
  Loader2,
  AlertTriangle,
  ArrowUpDown,
  FilterX,
  ClipboardList,
  MapPin,
  Eye,
  Edit2,
  Archive,
  MoreVertical,
} from "lucide-react";
import { useUserStore } from "../../../entities/user/store";
import { useSortableTable } from "../../../shared/lib/useSortableTable";
import { EmptyState } from "../../../components/ui/EmptyState";
import { AdminJobsTableRow } from "./AdminJobsTableRow";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { summarizeJobScope, formatInstallerName } from "../../../shared/lib/utils";
import { JOB_STATUSES } from "@/lib/constants/statuses";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

const SortIcon = ({ 
  columnKey, 
  sortConfig 
}: { 
  columnKey: string;
  sortConfig: { key: any; direction: "asc" | "desc" | null };
}) => {
  const isActive = sortConfig.key === columnKey;
  return (
    <ArrowUpDown className={`w-3 h-3 ml-2 transition-colors ${isActive && sortConfig.direction ? "text-rsg-gold" : "text-muted-foreground/30"}`} />
  );
};

export function AdminJobsTable({
  jobs,
  isLoading,
  error,
  onJobSelect,
  onUpdateInstaller,
  onArchiveJob,
  installers = ["installer_juan", "installer_carlos"],
}: {
  jobs: Job[];
  isLoading: boolean;
  error: Error | null;
  onJobSelect: (job: Job) => void;
  onUpdateInstaller: (jobId: string, installerId: string | null) => void;
  onArchiveJob?: (jobId: string) => void;
  installers?: string[];
}) {
  const { language, activeRole } = useUserStore();
  const t = dict[language].admin;

  const { sortedData, sortConfig, handleSort } = useSortableTable(jobs, "adminJobs", { key: "scheduled_arrival", direction: "desc" });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-foreground/50 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-rsg-gold" />
        <span className="text-sm font-mono tracking-widest uppercase">
          {t.loadingWorkOrders}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-red-500 gap-4">
        <AlertTriangle className="w-8 h-8" />
        <span className="text-sm">{t.databaseSyncError}</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Mobile Card List View (Visible only on Mobile) */}
      <div className="block md:hidden overflow-y-auto max-h-[700px] p-3 space-y-3 bg-background/30 custom-scrollbar">
        {sortedData.map((job) => {
          const isAssignmentLocked =
            job.status === JOB_STATUSES.ACTIVE ||
            job.status === JOB_STATUSES.REVIEW ||
            job.status === JOB_STATUSES.VERIFIED;
          return (
            <div
              key={job.id}
              onClick={() => onJobSelect(job)}
              className="bg-card border border-border p-3 rounded-md shadow-sm active:bg-rsg-surface-2 transition-all flex flex-col gap-2.5 relative group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black bg-rsg-gold/15 text-rsg-gold px-2 py-0.5 border border-rsg-gold/20 rounded">
                  {job.legacy_id}
                </span>
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <StatusBadge status={job.status} />
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-1 px-2 hover:bg-foreground/5 rounded border border-border transition-colors inline-flex items-center justify-center outline-none">
                      <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onJobSelect(job)} className="text-xs font-semibold uppercase tracking-widest gap-2 py-2">
                        <Eye className="w-3.5 h-3.5" />
                        {language === "es" ? "Ver Detalles" : "View Details"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.info("Coming soon")} className="text-xs font-semibold uppercase tracking-widest gap-2 py-2">
                        <Edit2 className="w-3.5 h-3.5" />
                        {language === "es" ? "Editar Orden" : "Edit Job"}
                      </DropdownMenuItem>
                      {activeRole === "admin" && onArchiveJob && (
                        <DropdownMenuItem 
                          onClick={() => {
                            onArchiveJob(job.id);
                            toast.success(`${language === "es" ? "Orden archivada" : "Job archived"}: ${job.legacy_id}`);
                          }}
                          className="text-xs font-semibold uppercase tracking-widest gap-2 text-rsg-error focus:text-rsg-error focus:bg-rsg-error/10 py-2"
                        >
                          <Archive className="w-3.5 h-3.5" />
                          {language === "es" ? "Archivar Orden" : "Archive Job"}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-foreground leading-snug">{job.client_name}</h4>
                <p className="text-[10px] text-muted-foreground uppercase flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-primary" />
                  {job.community_name || job.address.split(",")[0]}
                </p>
              </div>

              <div className="bg-muted/30 border border-border/40 p-2 text-xs text-foreground/80 leading-normal rounded">
                <p className="font-semibold text-foreground/90">
                  {summarizeJobScope(job.stoneapp_parts)}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase mt-0.5">
                  {job.job_type}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border/40">
                <div className="flex flex-col">
                  <span className="text-muted-foreground font-mono leading-none">
                    {job.scheduled_arrival || job.scheduled_date ? (
                      new Intl.DateTimeFormat(language === "es" ? "es-ES" : "en-US", {
                        month: "short",
                        day: "numeric",
                      }).format(new Date(job.scheduled_arrival || job.scheduled_date || ""))
                    ) : (
                      "TBD"
                    )}
                  </span>
                </div>

                <div onClick={(e) => e.stopPropagation()} className="relative">
                  <Select
                    disabled={isAssignmentLocked}
                    value={job.installer_id || "unassigned"}
                    onValueChange={(val) => onUpdateInstaller(job.id, val)}
                  >
                    <SelectTrigger className={`h-7 border border-border bg-sidebar rounded px-1.5 text-[10px] font-black uppercase tracking-wider w-28 ${isAssignmentLocked ? "opacity-40" : ""}`}>
                      <SelectValue>
                        {formatInstallerName(job.installer_id)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned" className="text-xs uppercase font-semibold">{t.unassigned}</SelectItem>
                      {installers.map((inst) => (
                        <SelectItem 
                          key={inst} 
                          value={inst} 
                          className="text-xs uppercase font-semibold"
                        >
                          {formatInstallerName(inst)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (Hidden on Mobile) */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden z-10" />
      <div className="overflow-auto max-h-[700px] hidden md:block">
        <table className="w-full text-left text-sm whitespace-nowrap relative border-separate border-spacing-0">
          <thead className="bg-surface sticky top-0 z-20 shadow-sm border-b border-border text-[10px]">
            <tr>
              <th 
                tabIndex={0}
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors border-b border-border outline-none focus:bg-primary/5"
                onClick={() => handleSort("legacy_id")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSort("legacy_id")}
              >
                <div className="flex items-center">
                  {t.legacyId}
                  <SortIcon columnKey="legacy_id" sortConfig={sortConfig} />
                </div>
              </th>
              <th 
                tabIndex={0}
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors border-b border-border outline-none focus:bg-primary/5"
                onClick={() => handleSort("client_name")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSort("client_name")}
              >
                <div className="flex items-center">
                  {t.client}
                  <SortIcon columnKey="client_name" sortConfig={sortConfig} />
                </div>
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left border-b border-border">{t.scope}</th>
              <th 
                tabIndex={0}
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors border-b border-border outline-none focus:bg-primary/5"
                onClick={() => handleSort("installer_id")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSort("installer_id")}
              >
                <div className="flex items-center">
                  {t.installer}
                  <SortIcon columnKey="installer_id" sortConfig={sortConfig} />
                </div>
              </th>
              <th 
                tabIndex={0}
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors border-b border-border outline-none focus:bg-primary/5"
                onClick={() => handleSort("status")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSort("status")}
              >
                <div className="flex items-center">
                  {t.status}
                  <SortIcon columnKey="status" sortConfig={sortConfig} />
                </div>
              </th>
              <th 
                tabIndex={0}
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors border-b border-border outline-none focus:bg-primary/5"
                onClick={() => handleSort("scheduled_arrival")}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSort("scheduled_arrival")}
              >
                <div className="flex items-center">
                  {t.installDate}
                  <SortIcon columnKey="scheduled_arrival" sortConfig={sortConfig} />
                </div>
              </th>
              <th className="px-4 py-2.5 border-b border-border w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
            {sortedData.map((job) => (
              <AdminJobsTableRow
                key={job.id}
                job={job}
                language={language}
                activeRole={activeRole}
                installers={installers}
                onJobSelect={onJobSelect}
                onUpdateInstaller={onUpdateInstaller}
                onArchiveJob={onArchiveJob}
                t={t}
              />
            ))}
          </tbody>
      </table>
      {jobs.length === 0 ? (
        <EmptyState 
          icon={ClipboardList}
          headline={language === "es" ? "Sin órdenes aún" : "No jobs yet"}
          subline={language === "es" ? "Importa datos o crea tu primera orden de trabajo" : "Import data or create your first work order"}
        />
      ) : sortedData.length === 0 ? (
        <EmptyState 
          icon={FilterX}
          headline={language === "es" ? "Ninguna orden coincide" : "No jobs match your filters"}
          subline={language === "es" ? "Prueba ajustando o limpiando tus filtros" : "Try adjusting or clearing your active filters"}
        />
      ) : null}
      </div>
    </div>
  );
}
