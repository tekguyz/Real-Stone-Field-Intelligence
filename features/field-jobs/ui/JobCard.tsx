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

export function JobCard({ job, language, index }: JobCardProps) {
  const t = dict[language].field;

  const navigateToAddress = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const query = encodeURIComponent(`${job.location.address}, ${job.location.city}, FL`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const getStatusBorder = () => {
    switch(job.status) {
      case 'in_progress': return 'border-l-8 border-l-primary border-y border-r border-border';
      case 'submitted_for_review': return 'border-l-8 border-l-amber-500 border-y border-r border-border';
      default: return 'border-l-8 border-l-foreground/30 border-y border-r border-border';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative group bg-card transition-all active:scale-[0.98] hover:bg-surface ${getStatusBorder()}`}
    >
      <Link href={`/field/job/${job.id}`} className="block">
        {/* Header Row */}
        <div className="flex justify-between items-start p-5 sm:p-6 pb-4">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60">
              {t.workOrder}: {job.legacy_id}
            </span>
            <h3 className="text-xl font-black text-foreground pr-10 leading-tight">
              {job.client_name}
            </h3>
          </div>

          <button 
            onClick={navigateToAddress}
            className="flex items-center justify-center w-12 h-12 bg-foreground/5 border border-border text-primary hover:bg-primary/10 active:scale-90 transition-all shrink-0"
            title={t.navigateToSite}
          >
            <Navigation className="w-5 h-5 fill-current" />
          </button>
        </div>

        {/* Location */}
        <div className="px-5 sm:px-6 pb-5 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-foreground/40" />
          <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider truncate max-w-[200px]">
            {job.location.community || job.location.city}
          </span>
        </div>

        {/* Scope Preview */}
        <div className="border-t border-border p-4 sm:px-6 flex justify-between items-center bg-foreground/[0.02] group-hover:bg-primary/[0.05] transition-colors">
          <div className="flex flex-col gap-1 w-full">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-foreground/60">
              {t.scope || 'Scope of Work'}
            </span>
            <p className="text-xs text-foreground font-bold leading-relaxed line-clamp-2 pr-4">
              {job.slab_info.slabs}x {job.slab_info.material} • {job.slab_info.thickness} • {job.slab_info.finish}
              {job.logistics_notes ? ` • ${job.logistics_notes}` : ''}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-foreground/30 group-hover:text-primary transition-colors shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
}
