'use client';

import { Job } from '../../../entities/job/types';
import { CheckCircle2 } from 'lucide-react';

const formatHumanDateTime = (dateStr: string | number) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  const datePart = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', month: 'short', day: 'numeric'
  }).format(d);
  const timePart = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true
  }).format(d);
  return `${datePart} • ${timePart}`;
};

interface ReportHeaderProps {
  job: Job;
  headerWoId: string;
}

export function ReportHeader({ job, headerWoId }: ReportHeaderProps) {
  return (
    <div className="border-b-4 border-foreground print:border-black p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
      <div className="flex flex-col z-10">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground print:text-black break-words">
          {job.client_name}
        </h1>
        <div className="mt-2 font-mono text-rsg-gold font-bold text-lg tracking-widest">
          {headerWoId}
        </div>
      </div>
      
      <div className="z-10 flex flex-col items-end text-right">
        <div className="flex items-center gap-2 bg-rsg-success text-white print:bg-black print:text-white px-4 py-2 border-2 border-rsg-success print:border-black">
          <CheckCircle2 className="w-5 h-5 text-white print:text-white" />
          <span className="font-black uppercase tracking-[0.2em] text-sm">Verified</span>
        </div>
        <span className="text-[10px] font-mono mt-2 text-foreground/60 print:text-black/60 uppercase">
          {job.updated_at ? formatHumanDateTime(job.updated_at) : 'N/A'}
        </span>
      </div>

      <div className="absolute -right-8 -top-8 text-foreground/5 print:text-black/5 rotate-12 pointer-events-none select-none">
        <CheckCircle2 className="w-64 h-64" />
      </div>
    </div>
  );
}
