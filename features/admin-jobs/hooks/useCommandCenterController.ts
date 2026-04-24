import { useState, useMemo } from 'react';
import { useJobs, useUpdateJobStatus, useUpdateJobInstaller } from '../../../entities/job/api';
import { Job } from '../../../entities/job/types';

export function useCommandCenterController() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { data: jobs, isLoading, error } = useJobs();
  const updateStatus = useUpdateJobStatus();
  const updateInstaller = useUpdateJobInstaller();

  const currentJobs = useMemo(() => jobs || [], [jobs]);

  const handleVerify = async (jobId: string) => {
    await updateStatus.mutateAsync({ jobId, status: 'verified' });
    setSelectedJob(null);
  };

  const handleUpdateInstaller = (jobId: string, installerId: string) => {
    const value = installerId === 'unassigned' ? null : installerId;
    updateInstaller.mutate({ jobId, installerId: value });
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob({ ...selectedJob, installer_id: value });
    }
  };

  const stats = useMemo(() => ({
    pending: currentJobs.filter(j => j.status === 'pending').length,
    active: currentJobs.filter(j => j.status === 'in_progress' || j.status === 'assigned').length,
    review: currentJobs.filter(j => j.status === 'submitted_for_review').length,
  }), [currentJobs]);

  return {
    selectedJob,
    setSelectedJob,
    currentJobs,
    isLoading,
    error,
    handleVerify,
    handleUpdateInstaller,
    isVerifying: updateStatus.isPending,
    stats
  };
}
