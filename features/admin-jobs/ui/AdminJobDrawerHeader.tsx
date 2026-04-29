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
    <div className="p-5 border-b border-border flex justify-between items-start bg-surface shrink-0">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs text-muted-foreground block uppercase tracking-widest">
          {headerWoId}
        </span>
        <div className="flex items-center gap-3 mt-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground uppercase leading-none">
            {job.client_name}
          </h2>
          <StatusBadge
            status={job.status}
            className="w-fit"
          />
        </div>
      </div>
      <button
        onClick={onClose}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        title={t.close}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
