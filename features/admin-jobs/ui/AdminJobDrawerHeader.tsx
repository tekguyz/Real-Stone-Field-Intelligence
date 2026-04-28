import { Job } from "../../../entities/job";
import { X } from "lucide-react";
import { StatusBadge } from "../../../components/ui/StatusBadge";

export function AdminJobDrawerHeader({
  job,
  onClose,
  t,
}: {
  job: Job;
  onClose: () => void;
  t: any;
}) {
  const displayId = job.wo_number || job.legacy_id?.substring(0, 8) || "";
  const headerWoId = displayId.startsWith("WO-") ? displayId : "WO-" + displayId;

  return (
    <div className="p-4 md:p-6 border-b border-border flex justify-between items-start bg-rsg-surface/30 pb-4 shrink-0">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[10px] text-foreground/40 block uppercase tracking-[0.2em]">
          {headerWoId}
        </span>
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-black tracking-tight uppercase leading-none">
            {job.client_name}
          </h2>
          <StatusBadge
            status={job.status}
            className="w-fit scale-90 origin-left"
          />
        </div>
      </div>
      <button
        onClick={onClose}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition-colors"
        title={t.close}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
