import { JobStatus } from '../types';
import { useUserStore } from '../../user/store';
import { dict } from '../../i18n/dict';

interface JobStatusBadgeProps {
  status: JobStatus;
  className?: string;
}

export function JobStatusBadge({ status, className = '' }: JobStatusBadgeProps) {
  const { language } = useUserStore();
  
  const getStatusStyles = (status: JobStatus) => {
    switch (status) {
      case 'verified':
        return 'bg-rsg-success text-white border-rsg-success/20';
      case 'in_progress':
        return 'bg-rsg-gold text-black border-black/10';
      case 'submitted_for_review':
        return 'bg-rsg-warning text-black border-rsg-warning/20 shadow-[3px_3px_0px_#1f1f1f] dark:shadow-[3px_3px_0px_white]';
      case 'assigned':
        return 'bg-foreground text-background border-transparent';
      case 'pending':
        return 'bg-zinc-200 dark:bg-zinc-800 text-foreground border-border';
      default:
        return 'bg-rsg-surface text-rsg-text border-rsg-border';
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-black uppercase tracking-[0.2em] border rounded-none ${getStatusStyles(status)} ${className}`}>
      {dict[language].status[status]}
    </div>
  );
}
