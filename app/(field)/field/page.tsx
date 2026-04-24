'use client';

import { useUserStore } from '../../../entities/user/store';
import { dict } from '../../../entities/i18n/dict';
import { useJobs } from '../../../entities/job/api';
import { ClipboardList, MapPin, ChevronRight, HardHat, Loader2, Navigation, Mountain } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { JobCard } from '../../../features/field-jobs/ui/JobCard';
import { SyncIndicator } from '../../../shared/ui/SyncIndicator';

export default function FieldPage() {
  const { activeRole, language } = useUserStore();
  const t = dict[language].field;
  
  const { data: jobs, isLoading, error, refetch } = useJobs();

  // Filter jobs for this specific installer
  const myJobs = jobs?.filter(j => j.installer_id === activeRole) || [];
  const activeCount = myJobs.filter(j => j.status === 'in_progress').length;

  return (
    <div className="flex flex-col min-h-full bg-background animate-in fade-in duration-500">
      {/* Neo-Brutalist Strict Header - Exactly h-14 */}
      <div className="h-14 px-4 bg-surface border-b border-border flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 max-w-[30%]">
          <div className="w-8 h-8 bg-primary/10 flex items-center justify-center shrink-0">
            <Mountain className="w-5 h-5 text-primary" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-primary truncate hidden sm:inline-block">
            {activeRole.split('_')[1]?.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2 max-w-[65%] justify-end overflow-hidden">
          <SyncIndicator />
          <h1 className="text-sm font-black tracking-widest text-foreground uppercase truncate hidden sm:block">{t.todaysWork}</h1>
        </div>
      </div>

      {/* Assignment List */}
      <div className="p-4 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
             <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/40 font-bold">Syncing HQ Pipeline</span>
          </div>
        ) : error ? (
          <div className="p-5 border-l-4 border-l-red-500 border-y border-r border-border bg-red-500/10 text-red-500 text-[10px] uppercase font-bold tracking-wider text-center">
            Failed to sync work orders. Please check connection.
          </div>
        ) : myJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border bg-foreground/[0.02]">
            <ClipboardList className="w-8 h-8 text-foreground/20 mb-3" />
            <span className="text-foreground/40 font-bold uppercase tracking-[0.2em] text-[10px]">{t.myAssignments} (0)</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {myJobs.map((job, index) => (
              <JobCard key={job.id} job={job} language={language} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
