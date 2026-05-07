import { useState, useEffect } from "react";
import { useJobs, useUpdateJobStatus } from "../../../entities/job/api";
import {
  processImage,
  ProcessedImage,
} from "../../../shared/lib/image-processor";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../../entities/user/store";
import { usePermissions } from "../../../shared/lib/usePermissions";
import { JOB_STATUSES } from "../../../lib/constants/statuses";
import { toast } from "sonner";

import { haptics } from "../../../shared/lib/haptics";
import { fieldStorage } from "../../../shared/lib/storage";

export function useFieldJobDetail(jobId: string) {
  const router = useRouter();
  const { isDevMode, language } = useUserStore();
  const { data: jobs, isLoading: isJobsLoading } = useJobs();
  const updateStatus = useUpdateJobStatus();
  const queryClient = useQueryClient();

  const [processedPhotos, setProcessedPhotos] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { cameraStatus, locationStatus, requestPermissions, checkStatus } =
    usePermissions();

  const job = jobs?.find((j) => j.id === jobId || j.legacy_id === jobId);
  const isVerified = job?.status === JOB_STATUSES.VERIFIED;

  const isFormValid = processedPhotos.length > 0;
  const isAlreadyActive = job?.status === JOB_STATUSES.ACTIVE;

  const handleStartJob = async () => {
    if (!job || isAlreadyActive || isVerified) return;
    setIsSubmitting(true);
    try {
      const { jobService } = await import("../../../entities/job/api");
      await jobService.updateJobStatus(job.id, JOB_STATUSES.ACTIVE, isDevMode);
      toast.success(language === "es" ? "Trabajo iniciado" : "Job started successfully.");
      haptics.success();
      
      queryClient.setQueryData(["jobs", isDevMode], (old: any) => {
        if (!old) return old;
        return old.map((j: any) =>
          j.id === job.id ? { ...j, status: JOB_STATUSES.ACTIVE } : j,
        );
      });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    } catch (e) {
      console.error(e);
      toast.error("Failed to start job");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Data Loss Prevention (Native beforeunload)
  useEffect(() => {
    const hasUnsavedChanges =
      processedPhotos.length > 0 || signatureData !== null;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isSubmitting && !isVerified) {
        e.preventDefault();
        e.returnValue = "Unsaved changes will be lost";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [processedPhotos.length, signatureData, isSubmitting, isVerified]);

  const handleSubmitReview = async () => {
    if (!isFormValid || !job || isVerified) return;
    setIsSubmitting(true);

    try {
      const { jobService } = await import("../../../entities/job/api");

      // Upload Photos
      for (const photo of processedPhotos) {
        await new Promise((r) => setTimeout(r, 10));
        await jobService.uploadPhoto(photo.blob, job.id, isDevMode);
      }

      // Upload Signature
      if (signatureData) {
        await jobService.uploadSignature(signatureData, job.id, isDevMode);
      }

      // Final State Update
      await jobService.updateJobStatus(
        job.id,
        JOB_STATUSES.REVIEW,
        isDevMode,
      );
      toast.success(language === "es" ? "Revisión enviada" : "Review submitted successfully.");
      
      haptics.success();

      // Trigger email summary via Server Action
      try {
        const { sendJobVerifiedEmail } = await import("../../../app/actions/send-notification");
        await sendJobVerifiedEmail({ ...job, status: JOB_STATUSES.REVIEW }, "4tekguyz@gmail.com")
          .catch(err => console.error("Non-blocking email notify error:", err));
      } catch (err) {
        console.error("Failed to trigger email notification", err);
      }

      queryClient.setQueryData(["jobs", isDevMode], (old: any) => {
        if (!old) return old;
        return old.map((j: any) =>
          j.id === job.id ? { ...j, status: JOB_STATUSES.REVIEW } : j,
        );
      });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });

      if (isDevMode && job) {
        await fieldStorage.removeItem(`field_captures_${job.id}`);
        sessionStorage.removeItem(`field_captures_${job.id}`);
        // Dispatch event to clear for Drawer
        window.dispatchEvent(new Event("field_capture_update"));
      }

      router.push("/field");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCaptureImage = async (e: React.ChangeEvent<HTMLInputElement> | { target: { files: File[] } }) => {
    if (isVerified) return;
    const files = "files" in e.target ? e.target.files : null;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    try {
      const isGallery = e.target && "id" in e.target && e.target.id === "gallery-input";
      const newPhotos: ProcessedImage[] = [];
      for (let i = 0; i < files.length; i++) {
        haptics.shutter();
        const processed = await processImage(files[i], isGallery);
        
        // Silent Fallback to Job Coordinates if no GPS lock
        if (!processed.metadata.lat && job?.lat && job?.lng) {
          processed.metadata.lat = job.lat;
          processed.metadata.lng = job.lng;
          processed.metadata.location_status = "manual"; 
        }
        
        newPhotos.push(processed);
      }

      if (isDevMode) {
        await new Promise((res) => setTimeout(res, 1000));
      }

      setProcessedPhotos((prev) => [...newPhotos, ...prev]);

      // DevMode Persistence: Save to IndexedDB
      if (isDevMode && job) {
        const fieldCaptures = (await fieldStorage.getItem(`field_captures_${job.id}`)) || 
          JSON.parse(sessionStorage.getItem(`field_captures_${job.id}`) || '{"photos": [], "proofs": [], "signature": null}');

        const photoPromises = newPhotos.map((p) => {
          return new Promise<{ base64: string; metadata: any }>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () =>
              resolve({
                base64: reader.result as string,
                metadata: p.metadata,
              });
            reader.readAsDataURL(p.blob);
          });
        });

        const base64Photos = await Promise.all(photoPromises);
        fieldCaptures.photos = [
          ...base64Photos.map((p) => p.base64),
          ...(fieldCaptures.photos || []),
        ];

        const newProofs = base64Photos.map((p) => ({
          url: p.base64,
          gps_time: p.metadata.gps_time,
          lat: p.metadata.lat,
          lng: p.metadata.lng,
          accuracy: p.metadata.accuracy,
          location_status: p.metadata.location_status,
        }));

        fieldCaptures.proofs = [...newProofs, ...(fieldCaptures.proofs || [])];

        await fieldStorage.setItem(`field_captures_${job.id}`, fieldCaptures);

        // Trigger a custom event to notify other components (like AdminJobDrawer in the same tab)
        window.dispatchEvent(new Event("field_capture_update"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      if ("value" in e.target) e.target.value = "";
    }
  };

  const removePhoto = async (index: number) => {
    if (isVerified) return;
    setProcessedPhotos((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });

    // Update persistence in DevMode
    if (isDevMode && job) {
      const fieldCaptures = (await fieldStorage.getItem(`field_captures_${job.id}`)) || 
        JSON.parse(sessionStorage.getItem(`field_captures_${job.id}`) || '{"photos": [], "signature": null}');
      
      fieldCaptures.photos.splice(index, 1);
      if (fieldCaptures.proofs) fieldCaptures.proofs.splice(index, 1);
      
      await fieldStorage.setItem(`field_captures_${job.id}`, fieldCaptures);
      window.dispatchEvent(new Event("field_capture_update"));
    }
  };

  // Signature persistence
  useEffect(() => {
    if (isDevMode && job && signatureData) {
      const syncSignature = async () => {
        const fieldCaptures = (await fieldStorage.getItem(`field_captures_${job.id}`)) || 
          JSON.parse(sessionStorage.getItem(`field_captures_${job.id}`) || '{"photos": [], "signature": null}');
        
        fieldCaptures.signature = signatureData;
        await fieldStorage.setItem(`field_captures_${job.id}`, fieldCaptures);
        window.dispatchEvent(new Event("field_capture_update"));
      };
      syncSignature();
    }
  }, [signatureData, isDevMode, job]);

  return {
    job,
    isJobsLoading,
    isSubmitting: isSubmitting || updateStatus.isPending,
    isFormValid,
    handleSubmitReview,
    processedPhotos,
    handleCaptureImage,
    removePhoto,
    isProcessing,
    signatureData,
    setSignatureData,
    cameraStatus,
    locationStatus,
    requestPermissions,
    handleStartJob,
    isAlreadyActive,
    isVerified,
  };
}
