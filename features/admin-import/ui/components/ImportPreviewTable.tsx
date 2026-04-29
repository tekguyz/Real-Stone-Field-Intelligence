import { CheckCircle2, AlertTriangle, Info, ArrowUpDown } from "lucide-react";
import { Job } from "../../../../entities/job/types";
import { JobStatus } from "../../../../lib/constants/statuses";
import { useUserStore } from "../../../../entities/user/store";
import { dict } from "../../../../entities/i18n/dict";
import { StatusBadge } from "../../../../components/ui/StatusBadge";
import { useSortableTable } from "../../../../shared/lib/useSortableTable";

const SortIcon = ({ 
  columnKey, 
  sortConfig 
}: { 
  columnKey: string;
  sortConfig: { key: any; direction: "asc" | "desc" | null };
}) => {
  const isActive = sortConfig.key === columnKey;
  return (
    <ArrowUpDown className={`w-3 h-3 ml-2 transition-colors ${isActive && sortConfig.direction ? "text-primary" : "text-muted-foreground/30"}`} />
  );
};

interface ImportPreviewTableProps {
  parsedData: Job[];
  selectedWoNumbers: Set<string>;
  toggleSelectAll: () => void;
  toggleJob: (wo: string) => void;
  clearData: () => void;
  setSelectedWoNumbers: (s: Set<string>) => void;
}

export function ImportPreviewTable({
  parsedData,
  selectedWoNumbers,
  toggleSelectAll,
  toggleJob,
  clearData,
  setSelectedWoNumbers,
}: ImportPreviewTableProps) {
  const { language } = useUserStore();
  const t = dict[language].admin;

  const { sortedData, sortConfig, handleSort } = useSortableTable(parsedData, "importPreview", { key: "wo_number", direction: "asc" });

  const hasErrorsInSet = (sortedData as any[]).some(j => !j.wo_number || !j.address);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            {t.dataHydrationReady}
          </span>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-xl font-bold tracking-tight text-foreground">
              {parsedData.length} {t.jobsDetected}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            clearData();
            setSelectedWoNumbers(new Set());
          }}
          className="text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-red-500 underline underline-offset-4"
        >
          {t.discardReset}
        </button>
      </div>

      <div className="border border-border overflow-x-auto bg-surface rounded-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface sticky top-0 z-10 border-b border-border">
              <th className="px-4 py-2.5 w-10 cursor-pointer group border-b border-border" onClick={toggleSelectAll}>
                <div className="w-4 h-4 border border-border bg-card flex items-center justify-center transition-colors group-hover:border-primary rounded-sm">
                  {selectedWoNumbers.size === parsedData.length && (
                    <div className="w-2 h-2 bg-primary rounded-sm" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors border-b border-border"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  {t.statusHeader}
                  <SortIcon columnKey="status" sortConfig={sortConfig} />
                </div>
              </th>
              <th 
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors border-b border-border w-24"
                onClick={() => handleSort("wo_number")}
              >
                <div className="flex items-center">
                  WO#
                  <SortIcon columnKey="wo_number" sortConfig={sortConfig} />
                </div>
              </th>
              <th 
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors border-b border-border"
                onClick={() => handleSort("client_name")}
              >
                <div className="flex items-center">
                  {t.clientHeader}
                  <SortIcon columnKey="client_name" sortConfig={sortConfig} />
                </div>
              </th>
              <th 
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left cursor-pointer hover:text-foreground transition-colors border-b border-border"
                onClick={() => handleSort("community_name")}
              >
                <div className="flex items-center">
                  {t.communityHeader}
                  <SortIcon columnKey="community_name" sortConfig={sortConfig} />
                </div>
              </th>
              {hasErrorsInSet && (
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left border-b border-border">
                  {t.errorsHeader}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(sortedData as any[]).map((job, idx) => {
              const hasError = !job.wo_number || !job.address;
              const isSelected = selectedWoNumbers.has(job.wo_number!);
              const isConflict = job.conflict;

              return (
                <tr
                  key={idx}
                  className={`transition-colors hover:bg-surface-2 group border-b border-border
                    ${hasError ? "bg-red-500/5" : ""} 
                    ${isSelected ? "bg-primary/5" : ""} 
                    ${isConflict ? "bg-amber-500/5" : ""}
                    ${isSelected ? "border-l border-l-primary" : "border-l border-l-transparent"}`}
                >
                  <td className="px-4 py-2.5 cursor-pointer" onClick={() => toggleJob(job.wo_number!)}>
                    <div className="w-4 h-4 border border-border bg-card flex items-center justify-center transition-colors group-hover:border-primary rounded-sm">
                      {isSelected && (
                        <div className="w-2 h-2 bg-primary rounded-sm" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 flex items-center gap-2">
                    <StatusBadge status={job.status as JobStatus} className="scale-90 origin-left" />
                    {isConflict && (
                      <div className="group/info relative flex items-center">
                        <span className="px-1.5 py-0.5 bg-muted text-muted-foreground font-semibold text-[10px] uppercase tracking-widest border border-border rounded-md ml-1">
                          {t.existingStatus}
                        </span>
                        <Info className="w-3 h-3 text-muted-foreground cursor-help ml-1" />
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-48 p-2 bg-card border border-border shadow-md opacity-0 group-hover/info:opacity-100 transition-opacity z-[60] pointer-events-none text-[10px] leading-tight font-medium text-foreground rounded-md">
                          {t.workOrderExistsTooltip}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-sm text-foreground">
                    {job.wo_number}
                  </td>
                  <td className="px-4 py-2.5 text-sm font-medium text-foreground">
                    {job.client_name}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground transition-colors">
                    {job.community_name || "N/A"}
                  </td>
                  {hasErrorsInSet && (
                    <td className="px-4 py-2.5">
                      {hasError && (
                        <div className="flex items-center gap-1 text-red-500 font-black uppercase text-[10px] tracking-widest">
                          <AlertTriangle className="w-3 h-3" />
                          {t.criticalDataMissing}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
