import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../shared/api/supabase';
import { mockJobs } from '../../shared/api/mock-data';
import { Job } from './types';
import { useUserStore } from '../user/store';

/**
 * Service orchestrator that intercepts calls based on isDevMode.
 */
export const jobService = {
  getJobs: async (isDevMode: boolean, authUid?: string): Promise<Job[]> => {
    if (isDevMode) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockJobs as any;
    }

    if (!supabase) {
      console.warn("Supabase client is not configured, falling back to mock jobs temporarily.");
      return mockJobs as any;
    }

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('scheduled_date', { ascending: true });

    if (error) {
      console.error("Supabase error fetching jobs:", error);
      throw error;
    }

    return (data || []).map(row => ({
      id: row.id,
      legacy_id: row.legacy_id,
      project_id: row.project_id,
      client_name: row.client_name,
      address: row.address,
      stoneapp_parts: row.stoneapp_parts as Job['stoneapp_parts'],
      status: row.status as Job['status'],
      job_type: row.job_type as Job['job_type'],
      scheduled_date: row.scheduled_date,
      installer_id: row.installer_id,
      logistics_notes: row.logistics_notes,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  },

  updateJobStatus: async (jobId: string, newStatus: Job['status'], isDevMode: boolean, payload?: any): Promise<void> => {
    if (isDevMode) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`[DevMode] Job ${jobId} status updated to ${newStatus}`);
      return;
    }

    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

    if (isOffline) {
      // Save locally and defer
      const { db } = await import('../../shared/api/sync-queue');
      await db.sync_queue.add({
        action: 'UPDATE_STATUS',
        payload: { jobId, newStatus, ...payload },
        timestamp: Date.now(),
        attempts: 0,
        status: 'pending'
      });
      console.log(`[Offline] Saved locally. Will sync ${jobId} when online.`);
      return;
    }

    if (!supabase) throw new Error("Supabase not configured");

    const { error } = await supabase
      .from('jobs')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', jobId);

    if (error) {
      // On failure to fetch/upload, also enqueue for offline resilience
      const { db } = await import('../../shared/api/sync-queue');
      await db.sync_queue.add({
        action: 'UPDATE_STATUS',
        payload: { jobId, newStatus, ...payload },
        timestamp: Date.now(),
        attempts: 0
      });
      console.log(`[Sync Error] Request failed. Saved locally. Will sync ${jobId} later.`);
      return;
    }
  },

  updateJobInstaller: async (jobId: string, installerId: string | null, isDevMode: boolean): Promise<void> => {
    if (isDevMode) {
      const job = mockJobs.find(j => j.id === jobId);
      if (job) {
        job.installer_id = installerId;
        job.updated_at = new Date().toISOString();
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`[DevMode] Job ${jobId} installer updated to ${installerId}`);
      return;
    }

    if (!supabase) throw new Error('Supabase client not initialized');

    const { error } = await supabase
      .from('jobs')
      .update({ installer_id: installerId, updated_at: new Date().toISOString() })
      .eq('id', jobId);

    if (error) {
      console.error(`[Sync Error] Failed to update installer for ${jobId}`, error);
      throw error;
    }
  },

  uploadPhoto: async (file: File | Blob, jobId: string, isDevMode: boolean): Promise<string> => {
    if (isDevMode) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return URL.createObjectURL(file);
    }

    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    
    if (isOffline) {
      const { db } = await import('../../shared/api/sync-queue');
      // Store blob natively
      await db.sync_queue.add({
        action: 'UPLOAD_PHOTO',
        payload: { jobId, blob: file },
        timestamp: Date.now(),
        attempts: 0,
        status: 'pending'
      });
      console.log(`[Offline] Photo queued for upload later.`);
      return URL.createObjectURL(file); // Return local URL for instant preview
    }

    if (!supabase) throw new Error("Supabase not configured");

    const fileName = `${jobId}/${Date.now()}-${(file as File).name || 'photo.jpg'}`;
    const { data, error: uploadError } = await supabase.storage
      .from('job-photos')
      .upload(fileName, file);

    if (uploadError) {
      // Offline fallback if request failed
      const { db } = await import('../../shared/api/sync-queue');
      await db.sync_queue.add({
        action: 'UPLOAD_PHOTO',
        payload: { jobId, blob: file },
        timestamp: Date.now(),
        attempts: 0
      });
      return 'pending-sync-url';
    }

    const { data: { publicUrl } } = supabase.storage
      .from('job-photos')
      .getPublicUrl(fileName);

    const { error: dbError } = await supabase
      .from('photos')
      .insert({
        job_id: jobId,
        storage_path: fileName // match master-reset schema which uses storage_path
      });

    if (dbError) throw dbError;

    return publicUrl;
  },

  uploadSignature: async (dataUrl: string, jobId: string, isDevMode: boolean): Promise<string> => {
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

    if (isOffline) {
      const { db } = await import('../../shared/api/sync-queue');
      await db.sync_queue.add({
        action: 'UPLOAD_SIGNATURE',
        payload: { jobId, data: dataUrl },
        timestamp: Date.now(),
        attempts: 0
      });
      console.log(`[Offline] Signature queued for upload later.`);
      return 'pending-sync-url';
    }

    if (isDevMode) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return 'signature-mock-url';
    }
    
    // For non-dev mode wait a sec (fake upload) 
    // In real env, convert dataUrl to blob and upload to bucket
    await new Promise(resolve => setTimeout(resolve, 500));
    return 'signature-mock-url';
  }
};

/**
 * FSD React Query hook to fetch jobs.
 */
export function useJobs() {
  const { isDevMode } = useUserStore();

  return useQuery({
    queryKey: ['jobs', isDevMode],
    queryFn: () => jobService.getJobs(isDevMode),
  });
}

/**
 * FSD hook to update job status.
 */
export function useUpdateJobStatus() {
  const { isDevMode } = useUserStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, status, payload }: { jobId: string, status: Job['status'], payload?: any }) => 
      jobService.updateJobStatus(jobId, status, isDevMode),
    onSuccess: () => {
      // Try invalidating
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
}

export function useUpdateJobInstaller() {
  const { isDevMode } = useUserStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, installerId }: { jobId: string, installerId: string | null }) => 
      jobService.updateJobInstaller(jobId, installerId, isDevMode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
}

/**
 * FSD hook to upload a job photo.
 */
export function useUploadPhoto() {
  const { isDevMode } = useUserStore();

  return useMutation({
    mutationFn: ({ file, jobId }: { file: File, jobId: string }) => 
      jobService.uploadPhoto(file, jobId, isDevMode),
  });
}
