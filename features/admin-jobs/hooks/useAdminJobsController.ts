import { useState, useMemo } from "react";
import { useJobs, useUpdateJobInstaller, useUpdateJobStatus } from "../../../entities/job/api";
import { Job } from "../../../entities/job/types";

export function useAdminJobsController() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [search, setSearch] = useState("");

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCityFilters, setSelectedCityFilters] = useState<string[]>([]);
  const [selectedInstallerFilters, setSelectedInstallerFilters] = useState<
    string[]
  >([]);

  const [sortConfig, setSortConfig] = useState<{
    key: "legacy_id" | "client_name" | "scheduled_arrival";
    direction: "asc" | "desc";
  }>({ key: "scheduled_arrival", direction: "desc" });

  const { data: jobs, isLoading, error } = useJobs();
  const updateInstaller = useUpdateJobInstaller();
  const updateStatus = useUpdateJobStatus();

  const handleUpdateInstaller = (jobId: string, installerId: string) => {
    const value = installerId === "unassigned" ? null : installerId;
    updateInstaller.mutate({ jobId, installerId: value });
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob({ ...selectedJob, installer_id: value });
    }
  };

  const handleVerify = async (jobId: string) => {
    await updateStatus.mutateAsync({ jobId, status: "verified" });

    const job = jobs?.find((j) => j.id === jobId);
    if (job) {
      try {
        const { sendJobVerifiedEmail } = await import("../../../app/actions/send-notification");
        await sendJobVerifiedEmail({ ...job, status: "verified" }, "4tekguyz@gmail.com")
          .catch(err => console.error("Non-blocking email notify error:", err));
      } catch (err) {
        console.error("Failed to trigger email notification", err);
      }
    }

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

  const handleSort = (key: "legacy_id" | "client_name" | "scheduled_arrival") => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredJobs = useMemo(
    () => {
      const filtered = currentJobs.filter((job) => {
        const matchesSearch =
          job.client_name.toLowerCase().includes(search.toLowerCase()) ||
          job.legacy_id.toLowerCase().includes(search.toLowerCase());

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
          matchesSearch && matchesStatus && matchesCity && matchesInstaller
        );
      });

      return [...filtered].sort((a, b) => {
        const key = sortConfig.key;
        let valA: any = a[key] || "";
        let valB: any = b[key] || "";
        
        if (key === "scheduled_arrival") {
          valA = a.scheduled_arrival || a.scheduled_date || "";
          valB = b.scheduled_arrival || b.scheduled_date || "";
        }
        
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    },
    [
      currentJobs,
      search,
      selectedStatuses,
      selectedCityFilters,
      selectedInstallerFilters,
      sortConfig,
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
    isVerifying: updateStatus.isPending,
    toggleFilter,
    handleSort,
    sortConfig,
  };
}
