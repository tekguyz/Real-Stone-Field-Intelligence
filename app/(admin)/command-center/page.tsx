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
    isVerifying,
    stats,
    installers,
  } = useCommandCenterController();

  return (
    <div className="flex flex-col gap-4 pb-10">
      {/* Header */}
      <div className="flex justify-between items-start bg-surface -mx-8 -mt-8 px-8 py-3 mb-0">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground uppercase leading-none">
            {t.commandCenter}
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-2 leading-none">
            {t.livePipeline}
          </p>
        </div>
        <button
          onClick={() => setIsImportOpen(true)}
          className="flex items-center gap-2 bg-rsg-gold text-black px-4 py-2 font-semibold tracking-widest uppercase transition-opacity hover:opacity-90 active:scale-[0.98] rounded-md shadow-sm border-0 print:hidden h-10"
        >
          <Database className="w-4 h-4" />
          {t.importData}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Left Column: Live Pipeline */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {t.livePipeline}
            </h2>
            <span className="text-xs font-mono text-foreground/40 text-nowrap">
              {currentJobs.length} RECORDS
            </span>
          </div>

          <CommandCenterTable
            jobs={currentJobs}
            isLoading={isLoading}
            error={error}
            onJobSelect={setSelectedJob}
            onUpdateInstaller={handleUpdateInstaller}
            installers={installers}
          />
        </div>

        {/* Right Column: Metrics & Alerts */}
        <div className="w-full lg:w-72 flex flex-col gap-4">
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
