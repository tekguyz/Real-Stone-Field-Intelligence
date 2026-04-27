"use client";

import { useUserStore } from "../../../entities/user/store";
import { dict } from "../../../entities/i18n/dict";
import { summarizeJobScope } from "../../../shared/lib/utils";
import { useCommandCenterController } from "../../../features/admin-jobs/hooks/useCommandCenterController";
import { CommandCenterTable } from "../../../features/admin-jobs/ui/CommandCenterTable";
import { AdminJobDrawer } from "../../../features/admin-jobs/ui/AdminJobDrawer";
import { TrendingUp, AlertTriangle, Database } from "lucide-react";
import { ImportModal } from "../../../features/admin-import/ui/ImportModal";
import { useState } from "react";
import { JOB_STATUSES } from "../../../lib/constants/statuses";

export default function CommandCenterPage() {
  const { language } = useUserStore();
  const t = dict[language].admin;
  const [isImportOpen, setIsImportOpen] = useState(false);

  const {
    selectedJob,
    setSelectedJob,
    currentJobs,
    isLoading,
    error,
    handleVerify,
    handleUpdateInstaller,
    isVerifying,
    stats,
  } = useCommandCenterController();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {t.commandCenter}
          </h1>
          <p className="text-foreground/50 mt-1 font-mono text-sm leading-none uppercase">
            {t.livePipeline}
          </p>
        </div>
        <button
          onClick={() => setIsImportOpen(true)}
          className="flex items-center gap-2 bg-foreground text-background px-5 py-3 font-black tracking-[0.2em] uppercase transition-opacity hover:opacity-90 active:scale-[0.98] border border-primary border-r-4 border-b-4 shadow-sm print:hidden"
        >
          <Database className="w-4 h-4 text-rsg-gold" />
          {t.importData}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Live Pipeline (75%) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-medium tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {t.livePipeline}
            </h2>
            <span className="text-xs font-mono text-foreground/40 text-nowrap">
              {currentJobs.length} {t.totalRecords}
            </span>
          </div>

          <CommandCenterTable
            jobs={currentJobs}
            isLoading={isLoading}
            error={error}
            onJobSelect={setSelectedJob}
          />
        </div>

        {/* Right Column: Metrics & Alerts (25%) */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          {/* Quick Metrics */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-medium tracking-tight tracking-tighter uppercase font-mono text-[10px] text-foreground/40">{t.metrics}</h2>

            {isLoading ? (
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-rsg-gold/5 animate-pulse h-20 border border-border"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    label: t.backlog,
                    value: stats.pending,
                    color: "border-zinc-500",
                    sub: t.pendingCount,
                  },
                  {
                    label: t.inField,
                    value: stats.active,
                    color: "border-rsg-gold",
                    sub: t.activeCount,
                  },
                  {
                    label: t.actionReq,
                    value: stats.review,
                    color: "border-rsg-warning",
                    sub: t.reviewCount,
                  },
                  {
                    label: t.verifiedShort,
                    value: currentJobs.filter(j => j.status === JOB_STATUSES.VERIFIED).length,
                    color: "border-rsg-success",
                    sub: t.completed,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`bg-card p-3 border- border-border transition-colors hover:bg-surface/50 border-l-4 ${stat.color} flex flex-col justify-between`}
                  >
                    <p className="text-[9px] font-mono text-foreground/40 uppercase tracking-widest leading-none">
                      {stat.label}
                    </p>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-2xl font-black text-foreground leading-none">
                        {stat.value}
                      </span>
                    </div>
                    <p className="text-[8px] font-mono text-foreground/30 uppercase mt-1 truncate">
                      {stat.sub}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Priority Alerts */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-medium tracking-tight tracking-tighter uppercase font-mono text-[10px] text-foreground/40">{t.alerts}</h2>
            {isLoading ? (
              <div className="flex flex-col gap-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-primary/5 animate-pulse h-20 border border-border"
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {currentJobs
                  .filter((j) => j.status === JOB_STATUSES.REVIEW)
                  .slice(0, 3)
                  .map((job) => (
                    <div
                      key={`alert-${job.id}`}
                      onClick={() => setSelectedJob(job)}
                      className="bg-primary/5 border border-primary/20 p-3 border-l-4 border-l-rsg-warning cursor-pointer hover:bg-primary/10 transition-colors group relative"
                    >
                      <div className="flex items-center gap-2 text-rsg-warning mb-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest">
                          {t.systemAlert}
                        </span>
                      </div>
                      <p className="text-sm font-bold group-hover:text-primary leading-tight">
                        {job.client_name}
                      </p>
                      <p className="text-[10px] font-mono text-foreground/40 mt-1 uppercase leading-snug truncate">
                        {job.legacy_id} •{" "}
                        {summarizeJobScope(job.stoneapp_parts)}
                      </p>
                    </div>
                  ))}
                {stats.review === 0 && (
                  <div className="p-4 border border-dashed border-border text-center">
                    <p className="text-xs text-foreground/50">
                      {t.noPriorityAlerts}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <AdminJobDrawer
        selectedJob={selectedJob}
        onClose={() => setSelectedJob(null)}
        onUpdateInstaller={handleUpdateInstaller}
        onVerifyJob={handleVerify}
        isVerifying={isVerifying}
      />

      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />
    </div>
  );
}
