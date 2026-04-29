import { JobStatus } from '@/lib/constants/statuses';

const statusStylesSleek: Record<string, string> = {
  Assigned: 'bg-status-assigned-bg text-status-assigned-text',
  Pending:  'bg-status-pending-bg text-status-pending-text',
  Active:   'bg-status-active-bg text-status-active-text',
  Review:   'bg-status-review-bg text-status-review-text',
  Verified: 'bg-status-verified-bg text-status-verified-text',
  Urgent:   'bg-[var(--status-urgent-bg)] text-[var(--status-urgent-text)]',
};

const statusStylesRugged: Record<string, string> = {
  Assigned: 'bg-status-assigned-bg text-status-assigned-text',
  Pending:  'bg-status-pending-bg text-status-pending-text',
  Active:   'bg-rsg-gold text-black border-2 border-foreground',
  Review:   'bg-status-review-bg text-status-review-text',
  Verified: 'bg-status-verified-bg text-status-verified-text',
  Urgent:   'bg-rsg-gold text-black border-2 border-foreground animate-pulse',
};

export function StatusBadge({ status, className = '', variant = 'sleek' }: { status: string, className?: string, variant?: 'sleek' | 'rugged' }) {
  // Normalize casing for lookup
  const normalizedStatus = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 'Pending';
  const styleRaw = variant === 'sleek' ? statusStylesSleek[normalizedStatus] || statusStylesSleek['Pending'] : statusStylesRugged[normalizedStatus] || statusStylesRugged['Pending'];
  
  const baseClasses = variant === 'sleek' 
    ? 'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-widest border border-transparent'
    : 'inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-black uppercase tracking-widest';

  return (
    <span className={`${baseClasses} ${styleRaw} ${className}`}>
      {normalizedStatus}
    </span>
  );
}
