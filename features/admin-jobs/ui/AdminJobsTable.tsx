import { Job } from '../../../entities/job/types';
import { dict } from '../../../entities/i18n/dict';
import { MapPin, ChevronRight, HardHat, Loader2, AlertTriangle } from 'lucide-react';
import { summarizeJobScope } from '../../../shared/lib/utils';
import { useUserStore } from '../../../entities/user/store';

const statusColors = {
  'pending': 'text-foreground/40 bg-foreground/5 border-foreground/10',
  'assigned': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  'in_progress': 'text-rsg-gold bg-rsg-gold/10 border-rsg-gold/20',
  'submitted_for_review': 'text-amber-950 bg-amber-500 border-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
  'verified': 'text-green-500 bg-green-500/10 border-green-500/20',
};

export function AdminJobsTable({ 
  jobs, 
  isLoading, 
  error, 
  onJobSelect,
  onUpdateInstaller
}: { 
  jobs: Job[], 
  isLoading: boolean, 
  error: Error | null,
  onJobSelect: (job: Job) => void,
  onUpdateInstaller: (jobId: string, installerId: string) => void
}) {
  const { language } = useUserStore();
  const t = dict[language].admin;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-foreground/50 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-rsg-gold" />
        <span className="text-sm font-mono tracking-widest uppercase">Loading Work Orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-red-500 gap-4">
        <AlertTriangle className="w-8 h-8" />
        <span className="text-sm">Database Sync Error</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-rsg-surface/50 text-foreground/60 font-medium border-b border-border">
          <tr>
            <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest">{t.legacyId}</th>
            <th className="px-6 py-4">{t.client} & {t.community}</th>
            <th className="px-6 py-4">{t.scope}</th>
            <th className="px-6 py-4">{t.installer}</th>
            <th className="px-6 py-4">{t.status}</th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {jobs.map(job => (
            <tr 
              key={job.id} 
              className="hover:bg-rsg-surface/30 transition-colors group cursor-pointer"
              onClick={() => onJobSelect(job)}
            >
              <td className="px-6 py-4 font-mono text-xs text-foreground/50">{job.legacy_id}</td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground/90">{job.client_name}</span>
                  <div className="flex items-center gap-1 text-[10px] text-foreground/40 font-mono italic uppercase mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {job.address}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-foreground/80">{summarizeJobScope(job.stoneapp_parts)}</span>
                  <span className="text-[10px] text-foreground/40 font-mono uppercase">{job.job_type}</span>
                </div>
              </td>
              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                <select 
                  className="bg-transparent border border-transparent hover:border-border cursor-pointer text-xs rounded-none px-2 py-1 font-mono uppercase focus:outline-none focus:border-primary transition-colors"
                  value={job.installer_id || 'unassigned'}
                  onChange={(e) => onUpdateInstaller(job.id, e.target.value)}
                >
                  <option value="unassigned" className="bg-surface text-foreground/40 italic">UNASSIGNED</option>
                  <option value="installer_juan" className="bg-surface text-foreground">JUAN</option>
                  <option value="installer_carlos" className="bg-surface text-foreground">CARLOS</option>
                </select>
              </td>
              <td className="px-6 py-4">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] border ${statusColors[job.status] || statusColors['pending']}`}>
                  <div className={`w-1 h-1 ${statusColors[job.status]?.split(' ')[0].replace('text-', 'bg-')}`} />
                  {dict[language].status[job.status]}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-primary transition-colors inline" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {jobs.length === 0 && (
        <div className="p-8 text-center text-foreground/50 text-sm">
          No matching work orders found.
        </div>
      )}
    </div>
  );
}
