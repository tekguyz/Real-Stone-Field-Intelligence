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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {t.workOrderManagement}
          </h1>
          <div className="flex bg-muted/50 p-1 border border-border mt-3 w-fit">
            <button
              onClick={() => setViewMode("active")}
              className={`text-[9px] font-black uppercase tracking-[0.2em] px-6 py-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold ${viewMode === "active" ? "bg-foreground text-background shadow-sm" : "text-foreground/40 hover:text-foreground/60"}`}
            >
              Active Jobs
            </button>
            <button
              onClick={() => setViewMode("archived")}
              className={`text-[9px] font-black uppercase tracking-[0.2em] px-6 py-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-rsg-gold ${viewMode === "archived" ? "bg-rsg-gold text-white shadow-sm" : "text-foreground/40 hover:text-foreground/60"}`}
            >
              Archived
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsImportOpen(true)}
            variant="outline"
            className="h-12 px-6 font-black tracking-[0.2em] uppercase border-r-4 border-b-4 border-primary rounded-none"
          >
            <Database className="w-4 h-4 text-rsg-gold mr-2" />
            {t.importData}
          </Button>
        </div>
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
