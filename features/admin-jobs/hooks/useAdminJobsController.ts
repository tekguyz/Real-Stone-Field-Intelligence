import { useState, useMemo } from "react";
import { useJobs, useUpdateJobInstaller } from "../../../entities/job/api";
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

  const { data: jobs, isLoading, error } = useJobs();
  const updateInstaller = useUpdateJobInstaller();

  const handleUpdateInstaller = (jobId: string, installerId: string) => {
    const value = installerId === "unassigned" ? null : installerId;
    updateInstaller.mutate({ jobId, installerId: value });
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob({ ...selectedJob, installer_id: value });
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
    () =>
      currentJobs.filter((job) => {
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
      }),
    [
      currentJobs,
      search,
      selectedStatuses,
      selectedCityFilters,
      selectedInstallerFilters,
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
    toggleFilter,
  };
}
