import { Job } from "../../../entities/job";
import { Loader2, ShieldCheck } from "lucide-react";
import { JOB_STATUSES } from "../../../lib/constants/statuses";

export function AdminJobDrawerFooter({
  job,
  onClose,
  onVerifyJob,
  isVerifying,
  activeRole,
  t,
}: {
  job: Job;
  onClose: () => void;
  onVerifyJob?: (jobId: string) => void;
  isVerifying: boolean;
  activeRole: string;
  t: any;
}) {
  return (
    <div className="p-5 border-t border-border bg-surface flex flex-col gap-4 shrink-0 rounded-b-md">
      {onVerifyJob && activeRole === "admin" && job.status === JOB_STATUSES.REVIEW && (
        <button
          onClick={() => onVerifyJob(job.id)}
          disabled={isVerifying}
          className="w-full h-10 rounded-md uppercase hover:opacity-90 transition-all flex items-center justify-center gap-2 bg-rsg-gold text-black font-semibold text-sm shadow-sm border-0"
        >
          {isVerifying ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ShieldCheck className="w-4 h-4" />
          )}
          {t.verifyAndClose}
        </button>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onClose}
          className="w-full h-10 rounded-md border border-border text-foreground font-semibold uppercase tracking-widest transition-colors bg-transparent hover:bg-accent hover:text-foreground text-xs shrink-0 shadow-sm"
        >
          {t.close}
        </button>
        <a
          href={`/admin/reports/${job.id}`}
          className="flex items-center justify-center rounded-md w-full h-10 bg-rsg-gold text-black font-semibold uppercase tracking-widest transition-colors hover:bg-rsg-gold/90 text-xs shrink-0 border-0 shadow-sm"
        >
          {t.viewReport}
        </a>
      </div>
    </div>
  );
}
