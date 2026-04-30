import { Job } from "../../../entities/job";
import { dict } from "../../../entities/i18n/dict";
import {
  Loader2,
  AlertTriangle,
  MapPin,
  ArrowUpDown,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Archive,
  FilterX,
  ClipboardList,
} from "lucide-react";
import { summarizeJobScope, formatInstallerName } from "../../../shared/lib/utils";
import { useUserStore } from "../../../entities/user/store";
import { useSortableTable } from "../../../shared/lib/useSortableTable";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { EmptyState } from "../../../components/ui/EmptyState";
import { JOB_STATUSES, ARCHIVE_STATUS } from "@/lib/constants/statuses";
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
import { toast } from "sonner";

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

export function CommandCenterTable({
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

  const { sortedData, sortConfig, handleSort } = useSortableTable(jobs, "commandCenter", { key: "scheduled_arrival", direction: "desc" });

  const handleArchive = (job: Job) => {
    if (onArchiveJob) {
      onArchiveJob(job.id);
      toast.success(`${language === "es" ? "Orden archivada" : "Job archived"}: ${job.legacy_id}`, {
        action: {
          label: language === "es" ? "Deshacer" : "Undo",
          onClick: () => toast.info("Undo not implemented in demo")
        }
      });
    }
  };

  return (
    <div className="bg-card border border-border flex flex-col h-full min-h-0">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center flex-1 min-h-[400px] text-foreground/50 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-rsg-gold" />
          <span className="text-sm font-mono tracking-widest uppercase">
            {t.syncingPipeline}
          </span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center flex-1 min-h-[400px] text-red-500 gap-4">
          <AlertTriangle className="w-8 h-8" />
          <span className="text-sm">{t.databaseSyncError}</span>
        </div>
      ) : (
        <div className="relative flex-1 min-h-0 flex flex-col">
          {/* Mobile Horizontal Scroll Hint */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden z-10" />
      <div className="overflow-auto flex-1 min-h-0 custom-scrollbar">
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
          {sortedData.map((job) => {
            const isAssignmentLocked =
              job.status === JOB_STATUSES.ACTIVE ||
              job.status === JOB_STATUSES.REVIEW ||
              job.status === JOB_STATUSES.VERIFIED;
            return (
              <tr
                key={job.id}
                tabIndex={0}
                className="hover:bg-rsg-surface-2 transition-colors cursor-pointer group outline-none focus:bg-rsg-surface-2 border-b border-border"
                onClick={() => onJobSelect(job)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onJobSelect(job)}
              >
                <td className="px-4 py-2.5 font-mono text-sm text-foreground">
                  {job.legacy_id}
                </td>
                <td className="px-4 py-2.5">
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
                <td className="px-4 py-2.5">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {summarizeJobScope(job.stoneapp_parts)}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase">
                      {job.job_type}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2.5" onClick={(e) => e.stopPropagation()}>
                  <div className="relative">
                    <Select
                      disabled={isAssignmentLocked}
                      value={job.installer_id || "unassigned"}
                      onValueChange={(val) => onUpdateInstaller(job.id, val)}
                    >
                      <SelectTrigger className={`h-8 border-transparent hover:border-border bg-transparent rounded-md px-2 text-xs font-semibold tracking-tight w-32 ${isAssignmentLocked ? "opacity-40" : ""}`}>
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
                </td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-4 py-2.5">
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
                      <span className="font-mono text-sm text-muted-foreground">
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
                <td className="px-4 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-2 hover:bg-foreground/5 rounded-md transition-colors inline-flex items-center justify-center outline-none focus:bg-foreground/10">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
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
                        {activeRole === "admin" && (
                          <DropdownMenuItem 
                            onClick={() => handleArchive(job)}
                            className="text-xs font-semibold uppercase tracking-widest gap-2 text-rsg-error focus:text-rsg-error focus:bg-rsg-error/10 py-2"
                          >
                            <Archive className="w-3.5 h-3.5" />
                            {language === "es" ? "Archivar Orden" : "Archive Job"}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                </td>
              </tr>
            );
          })}
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
      )}
    </div>
  );
}
