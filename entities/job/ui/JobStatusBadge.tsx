import { JobStatus } from "../types";
import { useUserStore } from "../../user/store";
import { dict } from "../../i18n/dict";

interface JobStatusBadgeProps {
  status: JobStatus;
  className?: string;
}

export function JobStatusBadge({
  status,
  className = "",
}: JobStatusBadgeProps) {
  const { language } = useUserStore();

  const getStatusStyles = (status: JobStatus) => {
    switch (status) {
      case "verified":
        return "bg-status-verified-bg text-status-verified-text border-transparent";
      case "in_progress":
        return "bg-status-active-bg text-status-active-text border-transparent";
      case "submitted_for_review":
        return "bg-status-review-bg text-status-review-text border-transparent shadow-[3px_3px_0px_#1f1f1f] dark:shadow-[3px_3px_0px_white]";
      case "assigned":
        return "bg-status-assigned-bg text-status-assigned-text border-transparent";
      case "pending":
        return "bg-status-pending-bg text-status-pending-text border-transparent";
      default:
        return "bg-status-assigned-bg text-status-assigned-text border-transparent";
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-black uppercase tracking-[0.2em] border-2 rounded-none ${getStatusStyles(status)} ${className}`}
    >
      {dict[language].status[status]}
    </div>
  );
}
