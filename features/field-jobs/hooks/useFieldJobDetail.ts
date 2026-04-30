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

  const [showPrimer, setShowPrimer] = useState(false);
  const [pendingCaptureType, setPendingCaptureType] = useState<
    "camera" | "gallery" | null
  >(null);

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

  const handleCaptureImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isVerified) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    try {
      const isGallery = pendingCaptureType === "gallery";
      const newPhotos: ProcessedImage[] = [];
      for (let i = 0; i < files.length; i++) {
        haptics.shutter();
        const processed = await processImage(files[i], isGallery);
        newPhotos.push(processed);
      }

      if (isDevMode) {
        await new Promise((res) => setTimeout(res, 1000));
      }

      setProcessedPhotos((prev) => [...newPhotos, ...prev]);

      // DevMode Persistence: Save to sessionStorage
      if (isDevMode && job) {
        const fieldCaptures = JSON.parse(
          sessionStorage.getItem(`field_captures_${job.id}`) ||
            '{"photos": [], "proofs": [], "signature": null}',
        );

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
          timestamp: p.metadata.timestamp,
          lat: p.metadata.lat,
          lng: p.metadata.lng,
          accuracy: p.metadata.accuracy,
          location_status: p.metadata.location_status,
        }));

        fieldCaptures.proofs = [...newProofs, ...(fieldCaptures.proofs || [])];

        sessionStorage.setItem(
          `field_captures_${job.id}`,
          JSON.stringify(fieldCaptures),
        );

        // Trigger a custom event to notify other components (like AdminJobDrawer in the same tab)
        window.dispatchEvent(new Event("field_capture_update"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      e.target.value = "";
    }
  };

  const removePhoto = (index: number) => {
    if (isVerified) return;
    setProcessedPhotos((prev) => {
      const photoToRemove = prev[index];
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);

      // Update sessionStorage in DevMode
      if (isDevMode && job) {
        const fieldCaptures = JSON.parse(
          sessionStorage.getItem(`field_captures_${job.id}`) ||
            '{"photos": [], "signature": null}',
        );
        fieldCaptures.photos.splice(index, 1);
        sessionStorage.setItem(
          `field_captures_${job.id}`,
          JSON.stringify(fieldCaptures),
        );
        window.dispatchEvent(new Event("field_capture_update"));
      }

      return updated;
    });
  };

  // Signature persistence
  useEffect(() => {
    if (isDevMode && job && signatureData) {
      const fieldCaptures = JSON.parse(
        sessionStorage.getItem(`field_captures_${job.id}`) ||
          '{"photos": [], "signature": null}',
      );
      fieldCaptures.signature = signatureData;
      sessionStorage.setItem(
        `field_captures_${job.id}`,
        JSON.stringify(fieldCaptures),
      );
      window.dispatchEvent(new Event("field_capture_update"));
    }
  }, [signatureData, isDevMode, job]);

  const checkPermissions = async (type: "camera" | "gallery") => {
    if (isVerified) return false;

    await checkStatus();

    // If both are already granted, update state and bypass primer
    if (cameraStatus === "granted" && locationStatus === "granted") {
      return true;
    }

    // If not granted, show primer
    setPendingCaptureType(type);
    setShowPrimer(true);
    return false;
  };

  const handleContinueCapture = async () => {
    const success = await requestPermissions();
    // Assuming we want to proceed and try capture anyway (fallback to unavailable, or standard fail flow)
    // The requirement says "If GPS fails to lock, store the image with location_status: 'timeout_unavailable'".
    // And if "Access Blocked" they can't continue, which is handled in Primer.
    // If we reach here and it was success or partially success, close primer and open picker
    setShowPrimer(false);
    const inputId =
      pendingCaptureType === "camera" ? "camera-input" : "gallery-input";
    document.getElementById(inputId)?.click();
  };

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
    showPrimer,
    setShowPrimer,
    cameraStatus,
    locationStatus,
    checkPermissions,
    handleContinueCapture,
    handleStartJob,
    isAlreadyActive,
    isVerified,
  };
}
