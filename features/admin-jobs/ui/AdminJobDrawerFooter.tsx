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
    <div className="p-4 md:p-6 border-t border-border bg-rsg-surface/30 flex flex-col gap-5 shrink-0">
      {onVerifyJob && activeRole === "admin" && job.status === JOB_STATUSES.REVIEW && (
        <button
          onClick={() => onVerifyJob(job.id)}
          disabled={isVerifying}
          className="w-full h-12 uppercase hover:opacity-90 transition-all flex items-center justify-center gap-3 bg-foreground text-background font-black text-sm tracking-[0.2em] shrink-0 border-2 border-foreground active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[4px_4px_0px_rgba(var(--rsg-gold-rgb),0.5)]"
        >
          {isVerifying ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-rsg-gold" />
          )}
          {t.verifyAndClose}
        </button>
      )}

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onClose}
          className="w-full h-12 border-2 border-foreground/20 text-foreground font-black uppercase tracking-[0.2em] transition-all bg-card hover:bg-foreground/5 text-sm shrink-0 rounded-none shadow-[4px_4px_0px_rgba(0,0,0,0.1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          {t.close}
        </button>
        <a
          href={`/admin/reports/${job.id}`}
          className="flex items-center justify-center w-full h-12 bg-foreground text-background font-black uppercase tracking-[0.2em] transition-all hover:bg-foreground/90 text-sm shrink-0 border-2 border-foreground shadow-[4px_4px_0px_rgba(0,0,0,0.1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          {t.viewReport}
        </a>
      </div>
    </div>
  );
}
