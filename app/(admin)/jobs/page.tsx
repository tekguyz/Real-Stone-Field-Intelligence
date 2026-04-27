"use client";

import { useUserStore } from "../../../entities/user/store";
import { dict } from "../../../entities/i18n/dict";
import { Database, Plus, Search } from "lucide-react";
import { useAdminJobsController } from "../../../features/admin-jobs/hooks/useAdminJobsController";
import { AdminJobsTable } from "../../../features/admin-jobs/ui/AdminJobsTable";
import { AdminJobsFilters } from "../../../features/admin-jobs/ui/AdminJobsFilters";
import { AdminJobDrawer } from "../../../features/admin-jobs/ui/AdminJobDrawer";
import { ImportModal } from "../../../features/admin-import/ui/ImportModal";
import { useState } from "react";

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
    selectedStatuses,
    setSelectedStatuses,
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
    isVerifying,
    toggleFilter,
    handleSort,
    sortConfig,
  } = useAdminJobsController();

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {t.workOrderManagement}
          </h1>
          <p className="text-foreground/50 mt-1 font-mono text-sm leading-none">
            {t.allActiveAndPendingInstallations}
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
        {/* Left Column (75%) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-card border border-border text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="bg-card border border-border min-h-[500px]">
            <AdminJobsTable
              jobs={filteredJobs}
              isLoading={isLoading}
              error={error}
              onJobSelect={setSelectedJob}
              onUpdateInstaller={handleUpdateInstaller}
              onSort={handleSort}
              sortConfig={sortConfig}
            />
          </div>
        </div>

        {/* Right Column - Filters (25%) */}
        <div className="lg:col-span-1">
          <AdminJobsFilters
            isLoading={isLoading}
            selectedStatuses={selectedStatuses}
            setSelectedStatuses={setSelectedStatuses}
            selectedCityFilters={selectedCityFilters}
            setSelectedCityFilters={setSelectedCityFilters}
            selectedInstallerFilters={selectedInstallerFilters}
            setSelectedInstallerFilters={setSelectedInstallerFilters}
            cities={cities}
            installers={installers}
            toggleFilter={toggleFilter}
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
      />
    </div>
  );
}
