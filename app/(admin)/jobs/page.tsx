"use client";

import { useUserStore } from "../../../entities/user/store";
import { dict } from "../../../entities/i18n/dict";
import { Database, Plus, Search, Archive, CheckCircle2 } from "lucide-react";
import { useAdminJobsController } from "../../../features/admin-jobs/hooks/useAdminJobsController";
import { AdminJobsTable } from "../../../features/admin-jobs/ui/AdminJobsTable";
import { AdminJobsFilters } from "../../../features/admin-jobs/ui/AdminJobsFilters";
import { AdminJobDrawer } from "../../../features/admin-jobs/ui/AdminJobDrawer";
import { ImportModal } from "../../../features/admin-import/ui/ImportModal";
import { useState } from "react";
import { Button } from "../../../components/ui/button";

export default function JobsPage() {
  const { language } = useUserStore();
  const t = dict[language].admin;
  const [isImportOpen, setIsImportOpen] = useState(false);

  const {
    isFormOpen,
    setIsFormOpen,
    selectedJob,
    setSelectedJob,
    search,
    setSearch,
    viewMode,
    setViewMode,
    selectedStatuses,
    setSelectedStatuses,
    preset,
    setPreset,
    selectedCityFilters,
    setSelectedCityFilters,
    selectedInstallerFilters,
    setSelectedInstallerFilters,
    isLoading,
    error,
    filteredJobs,
    cities,
    installers,
    handleUpdateInstaller,
    handleVerify,
    handleArchiveJob,
    isVerifying,
    toggleFilter,
    allJobs
  } = useAdminJobsController();

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <div className="flex justify-between items-start bg-surface -mx-8 -mt-8 px-8 py-6 mb-2">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground uppercase leading-none">
            {t.workOrderManagement}
          </h1>
          <div className="flex bg-muted/50 p-1 border border-border mt-4 w-fit rounded-md">
            <button
              onClick={() => setViewMode("active")}
              className={`text-xs font-semibold uppercase tracking-widest px-6 py-1.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold rounded-md ${
                viewMode === "active" 
                  ? "bg-foreground text-background shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Active Jobs
            </button>
            <button
              onClick={() => setViewMode("archived")}
              className={`text-xs font-semibold uppercase tracking-widest px-6 py-1.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold rounded-md ${
                viewMode === "archived" 
                  ? "bg-rsg-gold text-black shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Archived
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsImportOpen(true)}
          className="flex items-center gap-2 bg-rsg-gold text-black px-4 py-2 font-semibold tracking-widest uppercase transition-opacity hover:opacity-90 active:scale-[0.98] rounded-md shadow-sm border-0 print:hidden h-10"
        >
          <Database className="w-4 h-4" />
          {t.importData}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column (75%) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-card border border-border text-sm focus:outline-none focus:border-primary transition-colors h-12"
            />
          </div>

          <div className="bg-card border border-border min-h-[500px]">
            <AdminJobsTable
              jobs={filteredJobs}
              isLoading={isLoading}
              error={error}
              onJobSelect={setSelectedJob}
              onUpdateInstaller={handleUpdateInstaller}
              onArchiveJob={handleArchiveJob}
              installers={installers}
            />
          </div>
        </div>

        {/* Right Column - Filters (25%) */}
        <div className="lg:col-span-1">
          <AdminJobsFilters
            isLoading={isLoading}
            preset={preset}
            setPreset={setPreset}
            selectedStatuses={selectedStatuses}
            setSelectedStatuses={setSelectedStatuses}
            selectedCityFilters={selectedCityFilters}
            setSelectedCityFilters={setSelectedCityFilters}
            selectedInstallerFilters={selectedInstallerFilters}
            setSelectedInstallerFilters={setSelectedInstallerFilters}
            cities={cities}
            installers={installers}
            toggleFilter={toggleFilter}
            allJobs={allJobs}
          />
        </div>
      </div>

      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />

      <AdminJobDrawer
        selectedJob={selectedJob}
        onClose={() => setSelectedJob(null)}
        onUpdateInstaller={handleUpdateInstaller}
        onVerifyJob={handleVerify}
        isVerifying={isVerifying}
        installers={installers}
      />
    </div>
  );
}
