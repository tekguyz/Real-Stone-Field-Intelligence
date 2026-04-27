import { JobStatus } from '@/lib/constants/statuses';

const statusStyles: Record<string, string> = {
  Assigned: 'bg-status-assigned-bg text-status-assigned-text',
  Pending:  'bg-status-pending-bg  text-status-pending-text',
  Active:   'bg-status-active-bg   text-status-active-text',
  Review:   'bg-status-review-bg   text-status-review-text',
  Verified: 'bg-status-verified-bg text-status-verified-text',
};

export function StatusBadge({ status, className = '' }: { status: string, className?: string }) {
  // Normalize casing for lookup
  const normalizedStatus = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 'Pending';
  const style = statusStyles[normalizedStatus] || statusStyles['Pending'];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-black uppercase tracking-widest ${style} ${className}`}>
      {normalizedStatus}
    </span>
  );
}
