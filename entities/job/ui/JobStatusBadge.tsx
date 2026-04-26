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
        return "bg-status-verified text-white border-status-verified/40";
      case "in_progress":
        return "bg-status-active text-white border-status-active/40";
      case "submitted_for_review":
        return "bg-status-pending text-background border-status-pending/40 shadow-[3px_3px_0px_#1f1f1f] dark:shadow-[3px_3px_0px_white]";
      case "assigned":
        return "bg-foreground text-background border-transparent";
      case "pending":
        return "bg-status-pending text-background border-status-pending/40";
      default:
        return "bg-rsg-surface text-rsg-text border-rsg-border";
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
