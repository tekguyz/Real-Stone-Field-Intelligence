import { useState, useMemo } from "react";
import {
  useJobs,
  useUpdateJobStatus,
  useUpdateJobInstaller,
} from "../../../entities/job/api";
import { Job } from "../../../entities/job/types";
import { JOB_STATUSES } from "../../../lib/constants/statuses";

export function useCommandCenterController() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { data: jobs, isLoading, error } = useJobs();
  const updateStatus = useUpdateJobStatus();
  const updateInstaller = useUpdateJobInstaller();

  const currentJobs = useMemo(() => jobs || [], [jobs]);

  const handleVerify = async (jobId: string) => {
    await updateStatus.mutateAsync({ jobId, status: JOB_STATUSES.VERIFIED });

    // Find the job to pass its details
    const job = currentJobs.find((j) => j.id === jobId);
    if (job) {
      try {
        const { sendJobVerifiedEmail } = await import("../../../app/actions/send-notification");
        await sendJobVerifiedEmail({ ...job, status: JOB_STATUSES.VERIFIED }, "4tekguyz@gmail.com")
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
      pending: currentJobs.filter((j) => j.status === JOB_STATUSES.PENDING).length,
      active: currentJobs.filter(
        (j) => j.status === JOB_STATUSES.ACTIVE || j.status === JOB_STATUSES.ASSIGNED,
      ).length,
      review: currentJobs.filter((j) => j.status === JOB_STATUSES.REVIEW)
        .length,
    }),
    [currentJobs],
  );

  return {
    selectedJob,
    setSelectedJob,
    currentJobs,
    isLoading,
    error,
    handleVerify,
    handleUpdateInstaller,
    isVerifying: updateStatus.isPending,
    stats,
  };
}
