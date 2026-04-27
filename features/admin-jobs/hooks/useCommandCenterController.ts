import { useState, useMemo } from "react";
import {
  useJobs,
  useUpdateJobStatus,
  useUpdateJobInstaller,
} from "../../../entities/job/api";
import { Job } from "../../../entities/job/types";

export function useCommandCenterController() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [sortConfig, setSortConfig] = useState<{
    key: "legacy_id" | "client_name" | "scheduled_arrival";
    direction: "asc" | "desc";
  }>({ key: "scheduled_arrival", direction: "desc" });

  const { data: jobs, isLoading, error } = useJobs();
  const updateStatus = useUpdateJobStatus();
  const updateInstaller = useUpdateJobInstaller();

  const currentJobs = useMemo(() => jobs || [], [jobs]);

  const handleSort = (key: "legacy_id" | "client_name" | "scheduled_arrival") => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedJobs = useMemo(() => {
    return [...currentJobs].sort((a, b) => {
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
  }, [currentJobs, sortConfig]);

  const handleVerify = async (jobId: string) => {
    await updateStatus.mutateAsync({ jobId, status: "verified" });

    // Find the job to pass its details
    const job = currentJobs.find((j) => j.id === jobId);
    if (job) {
      try {
        const { sendJobVerifiedEmail } = await import("../../../app/actions/send-notification");
        await sendJobVerifiedEmail({ ...job, status: "verified" }, "4tekguyz@gmail.com")
          .catch(err => console.error("Non-blocking email notify error:", err));
      } catch (err) {
        console.error("Failed to trigger email notification", err);
      }
    }

    setSelectedJob(null);
  };

  const handleUpdateInstaller = (jobId: string, installerId: string) => {
    const value = installerId === "unassigned" ? null : installerId;
    updateInstaller.mutate({ jobId, installerId: value });
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob({ ...selectedJob, installer_id: value });
    }
  };

  const stats = useMemo(
    () => ({
      pending: currentJobs.filter((j) => j.status === "pending").length,
      active: currentJobs.filter(
        (j) => j.status === "in_progress" || j.status === "assigned",
      ).length,
      review: currentJobs.filter((j) => j.status === "submitted_for_review")
        .length,
    }),
    [currentJobs],
  );

  return {
    selectedJob,
    setSelectedJob,
    currentJobs: sortedJobs,
    isLoading,
    error,
    handleVerify,
    handleUpdateInstaller,
    isVerifying: updateStatus.isPending,
    stats,
    handleSort,
    sortConfig,
  };
}
