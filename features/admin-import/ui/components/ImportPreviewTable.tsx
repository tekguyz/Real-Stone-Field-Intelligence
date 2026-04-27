import { CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { Job } from "../../../../entities/job/types";
import { JobStatus } from "../../../../lib/constants/statuses";
import { useUserStore } from "../../../../entities/user/store";
import { dict } from "../../../../entities/i18n/dict";
import { StatusBadge } from "../../../../components/ui/StatusBadge";

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

  const hasErrorsInSet = (parsedData as any[]).some(j => !j.wo_number || !j.address);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-rsg-gold uppercase tracking-widest font-black">
            {t.dataHydrationReady}
          </span>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-xl font-black uppercase tracking-tight text-rsg-text">
              {parsedData.length} {t.jobsDetected}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            clearData();
            setSelectedWoNumbers(new Set());
          }}
          className="text-[10px] font-black uppercase tracking-widest text-rsg-text/60 hover:text-red-500 underline underline-offset-4"
        >
          {t.discardReset}
        </button>
      </div>

      <div className="border border-rsg-border overflow-x-auto bg-rsg-surface rounded-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface sticky top-0 z-10 border-b border-border">
              <th className="px-4 py-4 w-10 cursor-pointer group" onClick={toggleSelectAll}>
                <div className="w-4 h-4 border-2 border-border bg-card flex items-center justify-center transition-colors group-hover:border-primary rounded-none">
                  {selectedWoNumbers.size === parsedData.length && (
                    <div className="w-2 h-2 bg-primary" />
                  )}
                </div>
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left">
                {t.statusHeader}
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left">
                WO#
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left">
                {t.clientHeader}
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left">
                {t.communityHeader}
              </th>
              {hasErrorsInSet && (
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground text-left">
                  {t.errorsHeader}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-rsg-border">
            {(parsedData as any[]).map((job, idx) => {
              const hasError = !job.wo_number || !job.address;
              const isSelected = selectedWoNumbers.has(job.wo_number!);
              const isConflict = job.conflict;

              return (
                <tr
                  key={idx}
                  className={`transition-colors hover:bg-primary/5 group
                    ${hasError ? "bg-red-500/5" : ""} 
                    ${isSelected ? "bg-primary/10" : ""} 
                    ${isConflict ? "bg-amber-500/5" : ""}
                    ${isSelected ? "border-l-2 border-l-primary" : "border-l-2 border-l-transparent"}`}
                >
                  <td className="px-4 py-4 cursor-pointer" onClick={() => toggleJob(job.wo_number!)}>
                    <div className="w-4 h-4 border-2 border-border bg-card flex items-center justify-center transition-colors group-hover:border-primary rounded-none">
                      {isSelected && (
                        <div className="w-2 h-2 bg-primary rounded-none" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 flex items-center gap-2">
                    <StatusBadge status={job.status as JobStatus} className="scale-90 origin-left" />
                    {isConflict && (
                      <div className="group/info relative flex items-center">
                        <span className="px-1.5 py-0.5 bg-muted text-muted-foreground font-black text-[8px] uppercase tracking-widest border border-border rounded-none ml-1">
                          {t.existingStatus}
                        </span>
                        <Info className="w-3 h-3 text-muted-foreground cursor-help ml-1" />
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-48 p-2 bg-card border border-border shadow-xl opacity-0 group-hover/info:opacity-100 transition-opacity z-[60] pointer-events-none text-[9px] leading-tight font-medium uppercase tracking-wider text-foreground rounded-none">
                          {t.workOrderExistsTooltip}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-foreground">
                    {job.wo_number}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-foreground uppercase">
                    {job.client_name}
                  </td>
                  <td className="px-4 py-4 text-xs text-muted-foreground uppercase">
                    {job.community_name || "N/A"}
                  </td>
                  {hasErrorsInSet && (
                    <td className="px-4 py-4">
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
