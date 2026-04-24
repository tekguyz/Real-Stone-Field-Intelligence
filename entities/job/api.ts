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
    // 1. Mock Data Interceptor
    if (isDevMode) {
      // Simulate network request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockJobs;
    }

    // 2. Live Supabase Fetching
    if (!supabase) {
      console.warn("Supabase client is not configured, falling back to mock jobs temporarily.");
      return mockJobs;
    }

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('install_date', { ascending: true });

    if (error) {
      console.error("Supabase error fetching jobs:", error);
      throw error;
    }

    // Map the database layer to the application's entity representation
    return (data || []).map(row => ({
      id: row.id,
      legacy_id: row.legacy_id,
      client_name: row.client_name,
      location: {
        address: row.address,
        city: row.city,
        state: 'FL', // Hardcoding for FL operational region based on mock data patterns
        zip: '', // Database schema doesn't capture zip initially (could add later)
        community: row.community || undefined
      },
      slab_info: {
        material: row.scope ? row.scope.split(' - ')[0] : 'Unknown', // Basic parsing; actual prod would split columns
        finish: 'Polished', // Default assumption
        thickness: '3cm', // Default assumption
        slabs: 1
      },
      status: row.status as Job['status'],
      installer_id: row.installer_id,
      install_date: row.install_date,
      logistics_notes: row.logistics_notes
    }));
  },

  updateJobStatus: async (jobId: string, newStatus: Job['status'], isDevMode: boolean, payload?: any): Promise<void> => {
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

    if (isOffline) {
      // Save locally and defer
      const { db } = await import('../../shared/api/sync-queue');
      await db.sync_queue.add({
        action: 'UPDATE_STATUS',
        payload: { jobId, newStatus, ...payload },
        timestamp: Date.now(),
        attempts: 0
      });
      console.log(`[Offline] Saved locally. Will sync ${jobId} when online.`);
      return;
    }

    if (isDevMode) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`[DevMode] Job ${jobId} status updated to ${newStatus}`);
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

  uploadPhoto: async (file: File | Blob, jobId: string, isDevMode: boolean): Promise<string> => {
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    
    if (isOffline) {
      const { db } = await import('../../shared/api/sync-queue');
      // Store blob natively
      await db.sync_queue.add({
        action: 'UPLOAD_PHOTO',
        payload: { jobId, blob: file },
        timestamp: Date.now(),
        attempts: 0
      });
      console.log(`[Offline] Photo queued for upload later.`);
      return 'pending-sync-url';
    }

    if (isDevMode) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return URL.createObjectURL(file);
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
