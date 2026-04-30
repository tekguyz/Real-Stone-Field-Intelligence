import { JobStatus } from '@/lib/constants/statuses';

const statusStylesSleek: Record<string, string> = {
  Assigned: 'bg-[var(--status-assigned-bg)] text-[var(--status-assigned-text)]',
  Pending:  'bg-[var(--status-pending-bg)] text-[var(--status-pending-text)]',
  Active:   'bg-[var(--status-active-bg)] text-[var(--status-active-text)]',
  Review:   'bg-[var(--status-review-bg)] text-[var(--status-review-text)]',
  Verified: 'bg-[var(--status-verified-bg)] text-[var(--status-verified-text)]',
  Urgent:   'bg-[var(--status-urgent-bg)] text-[var(--status-urgent-text)]',
};

const statusStylesRugged: Record<string, string> = {
  Assigned: 'bg-[var(--status-assigned-bg)] text-[var(--status-assigned-text)]',
  Pending:  'bg-[var(--status-pending-bg)] text-[var(--status-pending-text)]',
  Active:   'bg-rsg-gold text-black border-2 border-foreground',
  Review:   'bg-[var(--status-review-bg)] text-[var(--status-review-text)]',
  Verified: 'bg-[var(--status-verified-bg)] text-[var(--status-verified-text)]',
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
