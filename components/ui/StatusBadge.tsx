import { JobStatus } from '@/lib/constants/statuses';

const statusStylesSleek: Record<string, string> = {
  Assigned: 'bg-[var(--status-assigned-bg)] text-[var(--status-assigned-text)] border-[var(--status-assigned-text)]/10',
  Pending:  'bg-[var(--status-pending-bg)] text-[var(--status-pending-text)] border-[var(--status-pending-text)]/10',
  Active:   'bg-[var(--status-active-bg)] text-[var(--status-active-text)] border-[var(--status-active-text)]/10',
  Review:   'bg-[var(--status-review-bg)] text-[var(--status-review-text)] border-[var(--status-review-text)]/10',
  Verified: 'bg-[var(--status-verified-bg)] text-[var(--status-verified-text)] border-[var(--status-verified-text)]/20',
  Urgent:   'bg-[var(--status-urgent-bg)] text-[var(--status-urgent-text)] border-[var(--status-urgent-text)]/20',
  Archived: 'bg-[var(--status-archived-bg)] text-[var(--status-archived-text)] border-[var(--status-archived-text)]/10',
};

const statusStylesRugged: Record<string, string> = {
  Assigned: 'bg-[var(--status-assigned-bg)] text-[var(--status-assigned-text)] border-2 border-current',
  Pending:  'bg-[var(--status-pending-bg)] text-[var(--status-pending-text)] border-2 border-current',
  Active:   'bg-[var(--status-active-bg)] text-[var(--status-active-text)] border-2 border-current',
  Review:   'bg-[var(--status-review-bg)] text-[var(--status-review-text)] border-2 border-current',
  Verified: 'bg-[var(--status-verified-bg)] text-[var(--status-verified-text)] border-2 border-current',
  Urgent:   'bg-[var(--status-urgent-bg)] text-[var(--status-urgent-text)] border-2 border-current animate-pulse font-black',
  Archived: 'bg-[var(--status-archived-bg)] text-[var(--status-archived-text)] border-2 border-current grayscale',
};

export function StatusBadge({ status, className = '', variant = 'sleek' }: { status: string, className?: string, variant?: 'sleek' | 'rugged' }) {
  // Normalize casing for lookup
  const normalizedStatus = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 'Pending';
  const styleRaw = variant === 'sleek' ? statusStylesSleek[normalizedStatus] || statusStylesSleek['Pending'] : statusStylesRugged[normalizedStatus] || statusStylesRugged['Pending'];
  
  const baseClasses = variant === 'sleek' 
    ? 'inline-flex items-center px-2 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest border shadow-sm'
    : 'inline-flex items-center px-2 py-1 rounded-none text-[10px] font-black uppercase tracking-widest border-2';

  return (
    <span className={`${baseClasses} ${styleRaw} ${className}`}>
      {normalizedStatus}
    </span>
  );
}
