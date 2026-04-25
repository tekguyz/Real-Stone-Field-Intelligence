'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { dict } from '../../../entities/i18n/dict';
import { Job, JobStatusBadge } from '../../../entities/job';
import { summarizeJobScope } from '../../../shared/lib/utils';
import { Clock, MapPin } from 'lucide-react';

interface JobCardProps {
  job: Job;
  language: 'en' | 'es';
  index: number;
}

export function JobCard({ job, language, index }: JobCardProps) {
  const getLocationText = () => {
    if (job.city_name && job.community_name) {
      return `${job.city_name.toUpperCase()} • ${job.community_name.toUpperCase()}`;
    }
    const parts = job.address.split(',');
    if (parts.length >= 2) {
      const city = parts[1].trim().toUpperCase();
      const streetOrCommunity = parts[0].trim().toUpperCase();
      return `${city} • ${streetOrCommunity}`;
    }
    return job.address.toUpperCase();
  };

  const formatScheduledTime = (isoDate: string | null | undefined) => {
    if (!isoDate) return 'WAITING TO BE ROUTED';
    try {
      const d = new Date(isoDate);
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
      }).format(d).toUpperCase();
    } catch {
      return isoDate;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative group bg-card transition-all active:scale-[0.98] border border-border rounded-none overflow-hidden mb-3`}
    >
      <Link href={`/field/job/${job.id}`} className="block p-3 sm:p-4">
        {/* Header Row: Client Name & Status Pill */}
        <div className="flex justify-between items-start gap-4 mb-0.5">
          <h3 className="text-lg font-bold text-foreground uppercase tracking-tight leading-tight">
            {job.client_name}
          </h3>
          <JobStatusBadge status={job.status} className="shrink-0 scale-75 origin-top-right" />
        </div>

        {/* WO-ID */}
        <div className="mb-1">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-rsg-gold">
            {job.legacy_id || `WO-${job.id.slice(0,6)}`}
          </span>
        </div>

        {/* Scope Summary */}
        <div className="mb-3">
          <p className="text-sm text-foreground/90 font-medium italic leading-tight truncate">
            {summarizeJobScope(job.stoneapp_parts)}
          </p>
        </div>

        {/* Meta Lines: Geography & Time */}
        <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-border/30 text-[10px]">
          <div className="flex items-center gap-1.5 text-foreground/50 tracking-wider">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{getLocationText()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground/50 tracking-wider">
            <Clock className="w-3 h-3 shrink-0" />
            <span>{formatScheduledTime(job.scheduled_arrival || job.scheduled_date)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
