import { useState, useMemo } from "react";
import { useJobs, useUpdateJobInstaller, useUpdateJobStatus } from "../../../entities/job/api";
import { Job } from "../../../entities/job/types";
import { JOB_STATUSES, ARCHIVE_STATUS } from "@/lib/constants/statuses";
import { useUserStore } from "../../../entities/user/store";

import { toast } from "sonner";

export function useAdminJobsController() {
  const { language } = useUserStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"active" | "archived">("active");

  const [preset, setPreset] = useState<string | null>(null); // "Today", "Unassigned", "Needs Review", "In Progress"
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCityFilters, setSelectedCityFilters] = useState<string[]>([]);
  const [selectedInstallerFilters, setSelectedInstallerFilters] = useState<
    string[]
  >([]);

  const { data: jobs, isLoading, error } = useJobs();
  const updateInstaller = useUpdateJobInstaller();
  const updateStatus = useUpdateJobStatus();

  const handleUpdateInstaller = (jobId: string, installerId: string | null) => {
    const value = (installerId === "unassigned" || installerId === null) ? null : installerId;
    updateInstaller.mutate({ jobId, installerId: value }, {
      onSuccess: () => {
        toast.success(language === "es" ? "Instalador actualizado." : "Installer assigned.");
      }
    });
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob({ ...selectedJob, installer_id: value });
    }
  };

  const handleVerify = async (jobId: string) => {
    // 1. Pre-flight check
    if (!jobId) return;

    try {
      // 2. Execute Status Update mutation
      await updateStatus.mutateAsync({ jobId, status: JOB_STATUSES.VERIFIED });
      toast.success(language === "es" ? "Trabajo verificado y cerrado." : "Job verified and closed.");

      // 3. Find job data for persistent notification
      const job = jobs?.find((j) => j.id === jobId);
      if (job) {
        try {
          const { sendJobVerifiedEmail } = await import("../../../app/actions/send-notification");
          await sendJobVerifiedEmail({ ...job, status: JOB_STATUSES.VERIFIED }, "4tekguyz@gmail.com")
            .catch(err => console.error("Non-blocking notification error:", err));
        } catch (err) {
          console.error("Dynamic import for notifications failed:", err);
        }
      }

      // 4. Close drawer on success
      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob(null);
      }
    } catch (err) {
      console.error("SYSTEM_FAILURE: Verification pipeline crashed:", err);
      toast.error(language === "es" ? "CRÍTICO: El proceso de verificación falló." : "CRITICAL: Verification process failed.");
    }
  };

  const handleArchiveJob = async (jobId: string) => {
    await updateStatus.mutateAsync({ jobId, status: ARCHIVE_STATUS });
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(null);
    }
  };

  const currentJobs = useMemo(() => jobs || [], [jobs]);

  const cities = useMemo(
    () =>
      Array.from(
        new Set(
          currentJobs
            .map((j) => j.address.split(",")[1]?.trim().split(" ")[0])
            .filter(Boolean),
        ),
      ),
    [currentJobs],
  );

  const installers = useMemo(
    () =>
      Array.from(
        new Set(
          currentJobs
            .map((j) => j.installer_id)
            .filter((id): id is string => Boolean(id)),
        ),
      ),
    [currentJobs],
  );

  const filteredJobs = useMemo(
    () => {
      const filtered = currentJobs.filter((job) => {
        // Filter by View Mode (Active vs Archived)
        const isArchived = job.status === ARCHIVE_STATUS;
        if (viewMode === "active" && isArchived) return false;
        if (viewMode === "archived" && !isArchived) return false;

        const matchesSearch =
          job.client_name.toLowerCase().includes(search.toLowerCase()) ||
          job.legacy_id.toLowerCase().includes(search.toLowerCase());

        let matchesPreset = true;
        if (preset === "Today") {
          const today = new Date().toISOString().split("T")[0];
          const jobDate = (job.scheduled_arrival || job.scheduled_date)?.split("T")[0];
          matchesPreset = today === jobDate;
        } else if (preset === "In Progress") {
          matchesPreset = job.status === JOB_STATUSES.ACTIVE;
        } else if (preset === "Needs Review") {
          matchesPreset = job.status === JOB_STATUSES.REVIEW;
        } else if (preset === "Unassigned") {
          matchesPreset = !job.installer_id;
        }

        const matchesStatus =
          selectedStatuses.length === 0 ||
          selectedStatuses.includes(job.status);
        const jobCity = job.address.split(",")[1]?.trim().split(" ")[0];
        const matchesCity =
          selectedCityFilters.length === 0 ||
          (jobCity && selectedCityFilters.includes(jobCity));
        const matchesInstaller =
          selectedInstallerFilters.length === 0 ||
          (job.installer_id
            ? selectedInstallerFilters.includes(job.installer_id)
            : selectedInstallerFilters.includes("unassigned"));

        return (
          matchesSearch && matchesStatus && matchesCity && matchesInstaller && matchesPreset
        );
      });

      return filtered;
    },
    [
      currentJobs,
      search,
      selectedStatuses,
      selectedCityFilters,
      selectedInstallerFilters,
      preset,
      viewMode,
    ],
  );

  const toggleFilter = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  return {
    isFormOpen,
    setIsFormOpen,
    selectedJob,
    setSelectedJob,
    search,
    setSearch,
    viewMode,
    setViewMode,
    preset,
    setPreset,
    selectedStatuses,
    setSelectedStatuses,
    selectedCityFilters,
    setSelectedCityFilters,
    selectedInstallerFilters,
    setSelectedInstallerFilters,
    isLoading,
    error,
    filteredJobs,
    allJobs: currentJobs,
    cities,
    installers,
    handleUpdateInstaller,
    handleVerify,
    handleArchiveJob,
    isVerifying: updateStatus.isPending,
    toggleFilter,
  };
}
