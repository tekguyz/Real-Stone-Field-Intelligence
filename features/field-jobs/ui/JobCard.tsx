"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { dict } from "../../../entities/i18n/dict";
import { Job, JobStatus } from "../../../entities/job";
import { summarizeJobScope } from "../../../shared/lib/utils";
import { Clock, MapPin } from "lucide-react";
import { StatusBadge } from "../../../components/ui/StatusBadge";

interface JobCardProps {
  job: Job;
  language: "en" | "es";
  index: number;
}

export function JobCard({ job, language, index }: JobCardProps) {
  const getLocationText = () => {
    if (job.city_name && job.community_name) {
      return `${job.city_name.toUpperCase()} • ${job.community_name.toUpperCase()}`;
    }
    const parts = job.address.split(",");
    if (parts.length >= 2) {
      const city = parts[1].trim().toUpperCase();
      const streetOrCommunity = parts[0].trim().toUpperCase();
      return `${city} • ${streetOrCommunity}`;
    }
    return job.address.toUpperCase();
  };

  const t = dict[language].field;

  const formatScheduledTime = (isoDate: string | null | undefined) => {
    if (!isoDate) return t.waitingToBeRouted;
    try {
      const d = new Date(isoDate);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
        .format(d)
        .toUpperCase();
    } catch {
      return isoDate;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative group bg-card transition-transform border border-border dark:border dark:border-primary/60 dark:shadow-none active:scale-[0.98] overflow-hidden`}
    >
      <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1 z-10">
        {job.is_urgent && (
          <StatusBadge 
            status="Urgent" 
            variant="rugged" 
            className="!px-2.0 !py-1.0 !text-[9px] font-bold tracking-widest border"
          />
        )}
        <StatusBadge
          status={job.status}
          variant="rugged"
          className="!px-1 !py-0 !text-[8px] font-bold tracking-widest border"
        />
      </div>

      <Link href={`/field/job/${job.id}`} className="block block-action">
        <div className="p-3 flex items-start">
          <div className="flex-1 min-w-0 pr-12">
            {/* Header Row: WO#, Client Name */}
            <div className="flex flex-col min-w-0 gap-0.5 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground leading-none">
                {job.legacy_id || `WO-${job.id.slice(0, 6)}`}
              </span>
              <h3 className="text-sm font-black text-foreground uppercase tracking-tight leading-tight truncate">
                {job.client_name}
              </h3>
            </div>

            {/* Scope Summary */}
            <div className="mb-3">
              <p className="text-sm text-foreground/90 font-medium italic leading-tight truncate">
                {summarizeJobScope(job.stoneapp_parts)}
              </p>
            </div>

            {/* Meta Lines: Geography & Time */}
            <div className="relative flex flex-col gap-1 mt-3 pt-3 border-t border-border/50 text-[10px] font-bold">
              <div className="flex items-center gap-1.5 text-foreground/50 tracking-widest w-full truncate">
                <MapPin className="w-3 h-3 shrink-0 text-primary" />
                <span className="truncate text-muted-foreground">{getLocationText()}</span>
              </div>
              <div className="flex items-center gap-1.5 text-foreground/50 tracking-widest leading-none mt-1">
                <Clock className="w-3 h-3 shrink-0 text-primary" />
                <span className="text-muted-foreground">
                  {formatScheduledTime(job.scheduled_arrival || job.scheduled_date)}
                </span>
              </div>
              <ChevronRight className="absolute right-[-40px] top-1/2 -translate-y-1/2 shrink-0 text-foreground/20" strokeWidth={3} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
