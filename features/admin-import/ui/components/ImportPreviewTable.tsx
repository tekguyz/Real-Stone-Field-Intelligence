import { CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { Job } from "../../../../entities/job/types";
import { useUserStore } from "../../../../entities/user/store";
import { dict } from "../../../../entities/i18n/dict";

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
            <tr className="bg-rsg-background border-b border-rsg-border">
              <th className="px-4 py-3 w-10">
                <div
                  onClick={toggleSelectAll}
                  className="w-4 h-4 border-2 border-rsg-border bg-rsg-surface flex items-center justify-center cursor-pointer transition-colors rounded-none"
                >
                  {selectedWoNumbers.size === parsedData.length && (
                    <div className="w-2 h-2 bg-rsg-gold" />
                  )}
                </div>
              </th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-rsg-text font-black">
                {t.statusHeader}
              </th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-rsg-text font-black">
                {t.woIdHeader}
              </th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-rsg-text font-black">
                {t.clientHeader}
              </th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-rsg-text font-black">
                {t.communityHeader}
              </th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-rsg-text font-black">
                {t.errorsHeader}
              </th>
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
                  className={`text-xs transition-colors hover:bg-rsg-background/50 
                    ${hasError ? "bg-red-500/5" : ""} 
                    ${isSelected ? "bg-rsg-gold/10" : ""} 
                    ${isConflict ? "bg-amber-500/5" : ""}
                    ${isSelected ? "border-l-2 border-l-rsg-gold" : "border-l-2 border-l-transparent"}`}
                >
                  <td className="px-4 py-3">
                    <div
                      onClick={() => toggleJob(job.wo_number!)}
                      className="w-4 h-4 border-2 border-rsg-border bg-rsg-surface flex items-center justify-center cursor-pointer transition-colors rounded-none"
                    >
                      {isSelected && (
                        <div className="w-2 h-2 bg-rsg-gold rounded-none" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {isConflict ? (
                      <div className="flex items-center gap-1.5">
                         <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-600 font-black text-[8px] uppercase tracking-widest border border-amber-500/30 rounded-none">
                          {t.existingStatus}
                        </span>
                        <div className="group relative">
                          <Info className="w-3 h-3 text-amber-500 cursor-help" />
                          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-48 p-2 bg-rsg-surface border border-rsg-border shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-[60] pointer-events-none text-[9px] leading-tight font-medium uppercase tracking-wider text-rsg-text rounded-none">
                            {t.workOrderExistsTooltip}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="px-1.5 py-0.5 bg-rsg-gold/20 text-rsg-gold font-black text-[8px] uppercase tracking-widest border border-rsg-gold/30 rounded-none">
                        {t.newStatus}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-rsg-gold">
                    {job.wo_number}
                  </td>
                  <td className="px-4 py-3 font-bold uppercase tracking-tight text-rsg-text">
                    {job.client_name}
                  </td>
                  <td className="px-4 py-3 uppercase text-rsg-text/70">
                    {job.community_name || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {hasError && (
                      <div className="flex items-center gap-1 text-red-500 font-black uppercase text-[10px] tracking-widest">
                        <AlertTriangle className="w-3 h-3" />
                        {t.criticalDataMissing}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
