"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../../entities/user/store";
import { dict } from "../../../entities/i18n/dict";
import { useJobs } from "../../../entities/job/api";
import { JOB_STATUSES } from "../../../lib/constants/statuses";
import {
  ClipboardList,
  MapPin,
  ChevronRight,
  HardHat,
  Loader2,
  Navigation,
  Mountain,
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { JobCard } from "../../../features/field-jobs/ui/JobCard";
import { SyncIndicator } from "../../../shared/ui/SyncIndicator";
import { formatInstallerName } from "../../../shared/lib/utils";

export default function FieldPage() {
  const { activeRole, language, _hasHydrated } = useUserStore();
  const t = dict[language].field;
  const router = useRouter();

  // Conditionally disable job fetch if admin (to prevent unneeded installer load)
  const isInstaller = activeRole?.startsWith("installer_");
  const {
    data: jobs,
    isLoading,
    error,
    refetch,
  } = useJobs({ enabled: _hasHydrated && isInstaller });

  useEffect(() => {
    if (_hasHydrated && activeRole === "admin") {
      router.replace("/command-center");
    }
  }, [_hasHydrated, activeRole, router]);

  if (!_hasHydrated || activeRole === "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  // Filter jobs for this specific installer
  const myJobs = jobs?.filter((j) => j.installer_id?.toLowerCase() === activeRole?.toLowerCase()) || [];
  const activeCount = myJobs.filter((j) => {
    const s = j.status?.toLowerCase();
    return (
      s === JOB_STATUSES.ACTIVE.toLowerCase() || 
      s === JOB_STATUSES.ASSIGNED.toLowerCase() ||
      s === JOB_STATUSES.PENDING.toLowerCase() ||
      s === "active" || s === "assigned" || s === "pending" || s === "in_progress"
    );
  }).length;

  return (
    <div className="flex flex-col min-h-full bg-background animate-in fade-in duration-500">
      {/* Neo-Brutalist Strict Header - Exactly h-16 */}
      <div className="sticky top-0 z-50 h-16 px-4 bg-background border-b border-border flex justify-between items-center shrink-0 w-full">
        <div className="flex items-center gap-2 max-w-[40%]">
          <div className="w-8 h-8 bg-primary/10 flex items-center justify-center shrink-0">
            <Mountain className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col truncate">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-rsg-gold truncate hidden sm:inline-block">
              {formatInstallerName(activeRole)}
            </span>
            <span className="font-mono text-[10px] uppercase font-bold text-foreground/50 hidden sm:inline-block">
              {activeCount} {language === "es" ? "ACTIVOS" : "ACTIVE"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 max-w-[60%] justify-end overflow-hidden">
          <SyncIndicator />
          <div className="flex flex-col text-right truncate">
            <h1 className="text-[12px] font-black tracking-widest text-foreground uppercase truncate">
              {t.todaysWork}
            </h1>
            <span className="text-[9px] font-mono uppercase text-foreground/50 tracking-widest sm:hidden">
              {activeCount} {language === "es" ? "ACTIVOS" : "ACTIVE"}
            </span>
          </div>
        </div>
      </div>

      {/* Assignment List */}
      <div className="p-4 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/40 font-bold">
              {language === "es" ? "SINCRONIZANDO PIPELINE HQ" : "Syncing HQ Pipeline"}
            </span>
          </div>
        ) : error ? (
          <div className="p-5 border-l-4 border-l-red-500 border-y border-r border-border bg-red-500/10 text-red-500 text-[10px] uppercase font-bold tracking-wider text-center">
            {language === "es" ? "Error al sincronizar órdenes. Por favor revise su conexión." : "Failed to sync work orders. Please check connection."}
          </div>
        ) : myJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border bg-foreground/[0.02]">
            <ClipboardList className="w-8 h-8 text-foreground/20 mb-3" />
            <span className="text-foreground/40 font-bold uppercase tracking-[0.2em] text-[10px]">
              {t.myAssignments} (0)
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {myJobs.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                language={language}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
