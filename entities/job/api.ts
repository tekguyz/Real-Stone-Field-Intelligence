import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../shared/api/supabase";
import { mockJobs } from "../../shared/api/mock-data";
import { Job } from "./types";
import { useUserStore } from "../user/store";
import { JOB_STATUSES, JobStatus } from "@/lib/constants/statuses";

function mapDbStatusToJobStatus(dbStatus: string): JobStatus {
  switch (dbStatus) {
    case "assigned": return JOB_STATUSES.ASSIGNED;
    case "in_progress": return JOB_STATUSES.ACTIVE;
    case "submitted_for_review": return JOB_STATUSES.REVIEW;
    case "verified": return JOB_STATUSES.VERIFIED;
    case "pending":
    default:
       return JOB_STATUSES.PENDING;
  }
}

function mapJobStatusToDbStatus(status: JobStatus): string {
  switch (status) {
    case JOB_STATUSES.ASSIGNED: return "assigned";
    case JOB_STATUSES.ACTIVE: return "in_progress";
    case JOB_STATUSES.REVIEW: return "submitted_for_review";
    case JOB_STATUSES.VERIFIED: return "verified";
    case JOB_STATUSES.PENDING:
    default:
       return "pending";
  }
}

/**
 * Service orchestrator that intercepts calls based on isDevMode.
 */
export const jobService = {
  getJobs: async (isDevMode: boolean, authUid?: string): Promise<Job[]> => {
    if (isDevMode) {
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Merge local overrides from sessionStorage if in DevMode
      const overrides =
        typeof window !== "undefined"
          ? sessionStorage.getItem("rsg-dev-overrides")
          : null;
      const parsedOverrides = overrides ? JSON.parse(overrides) : {};

      const imports =
        typeof window !== "undefined"
          ? sessionStorage.getItem("rsg-stoneapp-imports")
          : null;
      const parsedImports = imports ? JSON.parse(imports) : [];

      const allJobs = [...mockJobs, ...parsedImports];

      return allJobs.map((job) => {
        const override = parsedOverrides[job.id];
        if (override) {
          return {
            ...job,
            status: override.status || job.status,
            installer_id:
              override.installer_id !== undefined
                ? override.installer_id
                : job.installer_id,
            photos: [...(job.photos || []), ...(override.photos || [])],
            signature_url: override.signature_url || job.signature_url,
          };
        }
        return job;
      }) as any;
    }

    if (!supabase) {
      console.warn(
        "Supabase client is not configured, falling back to mock jobs temporarily.",
      );
      return mockJobs as any;
    }

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("scheduled_date", { ascending: true });

    if (error) {
      console.error("Supabase error fetching jobs:", error);
      throw error;
    }

    return (data || []).map((row) => ({
      id: row.id,
      legacy_id: row.legacy_id,
      project_id: row.project_id,
      client_name: row.client_name,
      address: row.address,
      stoneapp_parts: row.stoneapp_parts as Job["stoneapp_parts"],
      status: mapDbStatusToJobStatus(row.status),
      job_type: row.job_type as Job["job_type"],
      scheduled_date: row.scheduled_date,
      scheduled_arrival: row.scheduled_arrival,
      city_name: row.city_name,
      community_name: row.community_name,
      installer_id: row.installer_id,
      logistics_notes: row.logistics_notes,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  },

  updateJobStatus: async (
    jobId: string,
    newStatus: Job["status"],
    isDevMode: boolean,
    payload?: any,
  ): Promise<void> => {
    if (isDevMode) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const overrides = JSON.parse(
        sessionStorage.getItem("rsg-dev-overrides") || "{}",
      );
      if (!overrides[jobId]) overrides[jobId] = {};
      overrides[jobId].status = newStatus;
      sessionStorage.setItem("rsg-dev-overrides", JSON.stringify(overrides));

      console.log(`[DevMode] Job ${jobId} status updated to ${newStatus}`);
      return;
    }

    const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

    if (isOffline) {
      // Save locally and defer
      const { db } = await import("../../shared/api/sync-queue");
      await db.sync_queue.add({
        action: "UPDATE_STATUS",
        payload: { jobId, newStatus, ...payload },
        timestamp: Date.now(),
        attempts: 0,
        status: "pending",
      });
      console.log(`[Offline] Saved locally. Will sync ${jobId} when online.`);
      return;
    }

    if (!supabase) throw new Error("Supabase not configured");

    const { error } = await supabase
      .from("jobs")
      .update({ status: mapJobStatusToDbStatus(newStatus), updated_at: new Date().toISOString() })
      .eq("id", jobId);

    if (error) {
      // On failure to fetch/upload, also enqueue for offline resilience
      const { db } = await import("../../shared/api/sync-queue");
      await db.sync_queue.add({
        action: "UPDATE_STATUS",
        payload: { jobId, newStatus, ...payload },
        timestamp: Date.now(),
        attempts: 0,
      });
      console.log(
        `[Sync Error] Request failed. Saved locally. Will sync ${jobId} later.`,
      );
      return;
    }
  },

  updateJobInstaller: async (
    jobId: string,
    installerId: string | null,
    isDevMode: boolean,
  ): Promise<void> => {
    if (isDevMode) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const overrides = JSON.parse(
        sessionStorage.getItem("rsg-dev-overrides") || "{}",
      );
      if (!overrides[jobId]) overrides[jobId] = {};
      overrides[jobId].installer_id = installerId;
      sessionStorage.setItem("rsg-dev-overrides", JSON.stringify(overrides));

      console.log(`[DevMode] Job ${jobId} installer updated to ${installerId}`);
      return;
    }

    if (!supabase) throw new Error("Supabase client not initialized");

    const { error } = await supabase
      .from("jobs")
      .update({
        installer_id: installerId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    if (error) {
      console.error(
        `[Sync Error] Failed to update installer for ${jobId}`,
        error,
      );
      throw error;
    }
  },

  uploadPhoto: async (
    file: File | Blob,
    jobId: string,
    isDevMode: boolean,
  ): Promise<string> => {
    if (isDevMode) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const url = URL.createObjectURL(file);

      // Persist base64 to session storage for DevMode persistence
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        const overrides = JSON.parse(
          sessionStorage.getItem("rsg-dev-overrides") || "{}",
        );
        if (!overrides[jobId]) overrides[jobId] = {};
        if (!overrides[jobId].photos) overrides[jobId].photos = [];
        overrides[jobId].photos.push(base64data);
        sessionStorage.setItem("rsg-dev-overrides", JSON.stringify(overrides));
      };
      reader.readAsDataURL(file);

      return url;
    }

    const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

    if (isOffline) {
      const { db } = await import("../../shared/api/sync-queue");
      // Store blob natively
      await db.sync_queue.add({
        action: "UPLOAD_PHOTO",
        payload: { jobId, blob: file },
        timestamp: Date.now(),
        attempts: 0,
        status: "pending",
      });
      console.log(`[Offline] Photo queued for upload later.`);
      return URL.createObjectURL(file); // Return local URL for instant preview
    }

    if (!supabase) throw new Error("Supabase not configured");

    const fileName = `${jobId}/${Date.now()}-${(file as File).name || "photo.jpg"}`;
    const { data, error: uploadError } = await supabase.storage
      .from("photos")
      .upload(fileName, file);

    if (uploadError) {
      // Offline fallback if request failed
      const { db } = await import("../../shared/api/sync-queue");
      await db.sync_queue.add({
        action: "UPLOAD_PHOTO",
        payload: { jobId, blob: file },
        timestamp: Date.now(),
        attempts: 0,
      });
      return "pending-sync-url";
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("photos").getPublicUrl(fileName);

    const { error: dbError } = await supabase.from("photos").insert({
      job_id: jobId,
      storage_path: fileName, // match master-reset schema which uses storage_path
    });

    if (dbError) throw dbError;

    return publicUrl;
  },

  uploadSignature: async (
    dataUrl: string,
    jobId: string,
    isDevMode: boolean,
  ): Promise<string> => {
    if (isDevMode) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const overrides = JSON.parse(
        sessionStorage.getItem("rsg-dev-overrides") || "{}",
      );
      if (!overrides[jobId]) overrides[jobId] = {};
      overrides[jobId].signature_url = dataUrl;
      sessionStorage.setItem("rsg-dev-overrides", JSON.stringify(overrides));

      return dataUrl;
    }

    const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

    if (isOffline) {
      const { db } = await import("../../shared/api/sync-queue");
      await db.sync_queue.add({
        action: "UPLOAD_SIGNATURE",
        payload: { jobId, data: dataUrl },
        timestamp: Date.now(),
        attempts: 0,
      });
      console.log(`[Offline] Signature queued for upload later.`);
      return "pending-sync-url";
    }

    // For non-dev mode wait a sec (fake upload)
    // In real env, convert dataUrl to blob and upload to bucket
    await new Promise((resolve) => setTimeout(resolve, 500));
    return "signature-mock-url";
  },

  importJobs: async (jobs: Job[], isDevMode: boolean): Promise<void> => {
    if (isDevMode) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const existingImports = JSON.parse(
        sessionStorage.getItem("rsg-stoneapp-imports") || "[]",
      );
      const merged = [...existingImports];

      jobs.forEach((newJob) => {
        const index = merged.findIndex((j) => j.wo_number === newJob.wo_number);
        if (index > -1) {
          merged[index] = { ...merged[index], ...newJob };
        } else {
          merged.push(newJob);
        }
      });

      sessionStorage.setItem("rsg-stoneapp-imports", JSON.stringify(merged));
      console.log(`[DevMode] Bulk imported ${jobs.length} jobs.`);
      return;
    }

    if (!supabase) throw new Error("Supabase client not initialized");

    // Map internal Job to DB schema if necessary
    const dbJobs = jobs.map((j) => ({
      legacy_id: j.legacy_id,
      client_name: j.client_name,
      address: j.address,
      stoneapp_parts: j.stoneapp_parts,
      status: mapJobStatusToDbStatus(j.status),
      job_type: j.job_type,
      scheduled_date: j.scheduled_date,
      scheduled_arrival: j.scheduled_arrival,
      city_name: j.city_name,
      community_name: j.community_name,
      logistics_notes: j.logistics_notes,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("jobs")
      .upsert(dbJobs, { onConflict: "legacy_id" });

    if (error) {
      console.error("Supabase import error:", error);
      throw error;
    }
  },
};

/**
 * FSD React Query hook to fetch jobs.
 */
export function useJobs(options?: { enabled?: boolean }) {
  const { isDevMode } = useUserStore();

  return useQuery({
    queryKey: ["jobs", isDevMode],
    queryFn: () => jobService.getJobs(isDevMode),
    enabled: options?.enabled ?? true,
  });
}

/**
 * FSD hook to update job status.
 */
export function useUpdateJobStatus() {
  const { isDevMode } = useUserStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      status,
      payload,
    }: {
      jobId: string;
      status: Job["status"];
      payload?: any;
    }) => jobService.updateJobStatus(jobId, status, isDevMode),
    onSuccess: () => {
      // Try invalidating
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useUpdateJobInstaller() {
  const { isDevMode } = useUserStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      installerId,
    }: {
      jobId: string;
      installerId: string | null;
    }) => jobService.updateJobInstaller(jobId, installerId, isDevMode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

/**
 * FSD hook to upload a job photo.
 */
export function useUploadPhoto() {
  const { isDevMode } = useUserStore();

  return useMutation({
    mutationFn: ({ file, jobId }: { file: File; jobId: string }) =>
      jobService.uploadPhoto(file, jobId, isDevMode),
  });
}

export function useImportJobs() {
  const { isDevMode } = useUserStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobs: Job[]) => jobService.importJobs(jobs, isDevMode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
