"use client";

import { useUserStore } from "../../../entities/user/store";
import { dict } from "../../../entities/i18n/dict";
import { useCommandCenterController } from "../../../features/admin-jobs/hooks/useCommandCenterController";
import { CommandCenterTable } from "../../../features/admin-jobs/ui/CommandCenterTable";
import { AdminJobDrawer } from "../../../features/admin-jobs/ui/AdminJobDrawer";
import { CommandCenterMetrics } from "../../../features/admin-jobs/ui/CommandCenterMetrics";
import { CommandCenterAlerts } from "../../../features/admin-jobs/ui/CommandCenterAlerts";
import { TrendingUp, Database } from "lucide-react";
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
    handleArchive,
    isVerifying,
    stats,
    installers,
  } = useCommandCenterController();

  return (
    <div className="flex flex-col gap-4 pb-4 h-full min-h-0">
      {/* Header */}
      <div className="flex justify-between items-center bg-surface -mx-8 -mt-8 px-8 py-4 mb-4 border-b border-border shadow-sm">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-tighter text-foreground uppercase leading-none">
            {t.commandCenter}
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1 leading-none">
            {t.livePipeline}
          </p>
        </div>
        <button
          onClick={() => setIsImportOpen(true)}
          className="flex items-center gap-2 bg-rsg-gold text-black px-4 py-2 text-xs font-black tracking-widest uppercase transition-all hover:opacity-90 active:scale-[0.98] rounded-md shadow-sm border-0 print:hidden h-10 cursor-pointer"
        >
          <Database className="w-4 h-4" />
          {t.importData}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-stretch flex-1 min-h-0">
        {/* Left Column: Table container */}
        <div className="flex-1 w-full flex flex-col gap-2 min-h-0">
          <div className="flex justify-end">
            <span className="text-[10px] font-mono font-black text-muted-foreground/60 uppercase tracking-widest">
              {currentJobs.length} TOTAL RECORDS
            </span>
          </div>
          <div className="bg-card border border-border shadow-sm flex-1 min-h-0">
            <CommandCenterTable
              jobs={currentJobs}
              isLoading={isLoading}
              error={error}
              onJobSelect={setSelectedJob}
              onUpdateInstaller={handleUpdateInstaller}
              onArchiveJob={handleArchive}
              installers={installers}
            />
          </div>
        </div>

        {/* Right Column: Metrics & Alerts */}
        <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0 lg:sticky lg:top-4 h-fit">
          <CommandCenterMetrics 
            stats={stats} 
            verifiedCount={currentJobs.filter((j) => j.status === JOB_STATUSES.VERIFIED).length} 
            isLoading={isLoading} 
          />
          <CommandCenterAlerts 
            currentJobs={currentJobs} 
            stats={stats} 
            isLoading={isLoading} 
            onJobSelect={setSelectedJob} 
          />
        </div>
      </div>

      <AdminJobDrawer
        selectedJob={selectedJob}
        onClose={() => setSelectedJob(null)}
        onUpdateInstaller={handleUpdateInstaller}
        onVerifyJob={handleVerify}
        isVerifying={isVerifying}
        installers={installers}
      />

      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />
    </div>
  );
}
