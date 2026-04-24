'use client';

import { MapPin, Navigation, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { dict } from '../../../entities/i18n/dict';
import { Job } from '../../../entities/job';

interface JobCardProps {
  job: Job;
  language: 'en' | 'es';
  index: number;
}

import { summarizeJobScope } from '../../../shared/lib/utils';

export function JobCard({ job, language, index }: JobCardProps) {
  const t = dict[language].field;

  const navigateToAddress = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const query = encodeURIComponent(job.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

    const getStatusLabel = () => {
      switch(job.status) {
        case 'in_progress': return dict[language].status.in_progress;
        case 'submitted_for_review': return dict[language].status.submitted_for_review;
        case 'assigned': return dict[language].status.assigned;
        case 'verified': return dict[language].status.verified;
        default: return dict[language].status.pending;
      }
    };

    const getStatusBorder = () => {
      switch(job.status) {
        case 'in_progress': return 'border-primary bg-primary text-background';
        case 'submitted_for_review': return 'border-amber-500 bg-amber-500 text-background';
        case 'assigned': return 'border-blue-500 bg-blue-500 text-background';
        case 'verified': return 'border-green-500 bg-green-500 text-background';
        default: return 'border-foreground/30 bg-foreground text-background';
      }
    };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative group bg-card transition-all active:scale-[0.98] hover:bg-surface border border-border rounded-none`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-center items-center border-r border-border overflow-hidden">
        <div className={`absolute inset-0 ${getStatusBorder()}`} />
        <span className={`relative rotate-180 transform [writing-mode:vertical-rl] text-[10px] uppercase font-black tracking-widest whitespace-nowrap p-2 ${getStatusBorder().split(' ').slice(2).join(' ')}`}>
          {getStatusLabel()}
        </span>
      </div>

      <Link href={`/field/job/${job.id}`} className="block pl-8">
        {/* Header Row */}
        <div className="flex justify-between items-start p-5 sm:p-6 pb-5">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[11px] font-black uppercase tracking-widest text-primary">
              {job.legacy_id}
            </span>
            <h3 className="text-xl font-black text-foreground pr-8 leading-tight">
              {job.client_name}
            </h3>
          </div>

          <button 
            onClick={navigateToAddress}
            className="flex items-center justify-center w-12 h-12 bg-surface border border-border text-primary hover:bg-primary/10 active:scale-90 transition-all shrink-0 rounded-none"
            title={t.navigateToSite}
          >
            <Navigation className="w-5 h-5 fill-current" />
          </button>
        </div>

        {/* Scope Preview */}
        <div className="border-t border-border p-4 sm:px-6 flex justify-between items-center bg-foreground/[0.02] group-hover:bg-primary/[0.05] transition-colors rounded-none">
          <div className="flex flex-col gap-1 w-full">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-foreground/60">
              {t.scope || 'Scope of Work'}
            </span>
            <p className="text-xs text-foreground font-bold leading-relaxed line-clamp-2 pr-4">
              {summarizeJobScope(job.stoneapp_parts)}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-foreground/30 group-hover:text-primary transition-colors shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
}
