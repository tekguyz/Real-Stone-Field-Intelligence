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
        return 'bg-rsg-success text-white border-rsg-border';
      case 'in_progress':
        return 'bg-rsg-gold text-[#1f1f1f] border-[#1f1f1f]/20';
      case 'submitted_for_review':
        return 'bg-rsg-gold text-[#1f1f1f] border-[#1f1f1f]/20 shadow-[3px_3px_0px_#1f1f1f]';
      case 'assigned':
        return 'bg-rsg-surface text-rsg-text border-rsg-border';
      case 'pending':
        return 'bg-rsg-warning text-[#1f1f1f] border-[#1f1f1f]/20';
      default:
        return 'bg-rsg-surface text-rsg-text border-rsg-border';
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-black uppercase tracking-[0.2em] border rounded-none ${getStatusStyles(status)} ${className}`}>
      <div className={`w-1.5 h-1.5 rounded-none ${status === 'verified' ? 'bg-rsg-surface' : 'bg-rsg-border'} opacity-50`} />
      {dict[language].status[status]}
    </div>
  );
}
