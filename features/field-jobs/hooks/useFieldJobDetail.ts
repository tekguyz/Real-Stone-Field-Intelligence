import { useState } from 'react';
import { useJobs, useUpdateJobStatus } from '../../../entities/job/api';
import { processImage, ProcessedImage } from '../../../shared/lib/image-processor';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../../../entities/user/store';

export function useFieldJobDetail(jobId: string) {
  const router = useRouter();
  const { isDevMode } = useUserStore();
  const { data: jobs, isLoading: isJobsLoading } = useJobs();
  const updateStatus = useUpdateJobStatus();
  const queryClient = useQueryClient();

  const [processedPhotos, setProcessedPhotos] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isUnattended, setIsUnattended] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showPrimer, setShowPrimer] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [pendingCaptureType, setPendingCaptureType] = useState<'camera' | 'gallery' | null>(null);

  const job = jobs?.find(j => j.id === jobId || j.legacy_id === jobId);

  const isFormValid = processedPhotos.length > 0 && (isUnattended || signatureData !== null);

  const handleSubmitReview = async () => {
    if (!isFormValid || !job) return;
    setIsSubmitting(true);
    
    try {
      const { jobService } = await import('../../../entities/job/api');
      
      // Upload Photos
      for (const photo of processedPhotos) {
        await new Promise(r => setTimeout(r, 10)); 
        await jobService.uploadPhoto(photo.blob, job.id, isDevMode);
      }
      
      // Upload Signature
      if (signatureData) {
        await jobService.uploadSignature(signatureData, job.id, isDevMode);
      }
      
      // Final State Update
      await jobService.updateJobStatus(job.id, 'submitted_for_review', isDevMode);

      queryClient.setQueryData(['jobs', isDevMode], (old: any) => {
        if (!old) return old;
        return old.map((j: any) => 
          j.id === job.id ? { ...j, status: 'submitted_for_review' } : j
        );
      });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      
      router.push('/field');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCaptureImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    try {
      const newPhotos: ProcessedImage[] = [];
      for (let i = 0; i < files.length; i++) {
         const processed = await processImage(files[i]);
         newPhotos.push(processed);
      }
      
      if (isDevMode) {
        await new Promise(res => setTimeout(res, 1000));
      }

      setProcessedPhotos(prev => [...newPhotos, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const removePhoto = (index: number) => {
    setProcessedPhotos(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
  };

  const checkPermissions = async (type: 'camera' | 'gallery') => {
    if (permissionStatus === 'granted') return true;
    setPendingCaptureType(type);
    setShowPrimer(true);
    return false;
  };

  const handleContinueCapture = async () => {
    setShowPrimer(false);
    try {
      // 1. Check Camera (Attempt to trigger browser permission prompt)
      // If the device has no camera, we proceed anyway as they might use Gallery
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (camErr: any) {
        console.warn("Camera check failed:", camErr.message || camErr.name);
      }
      
      // 2. Check Geolocation (Attempt to trigger browser permission prompt)
      // We make this non-fatal because getting a GPS fix can be slow or fail.
      // The image-processor.ts also has its own async geolocation fetch.
      try {
        await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(resolve, resolve, { 
            timeout: 5000, 
            maximumAge: 30000 
          });
        });
      } catch (geoErr: any) {
        console.warn("Geolocation check failed or timed out during primer:", geoErr.message || geoErr.code);
      }
      
      setPermissionStatus('granted');
      const inputId = pendingCaptureType === 'camera' ? 'camera-input' : 'gallery-input';
      document.getElementById(inputId)?.click();
    } catch (err: any) {
      console.error("Critical Permission Error in handleContinueCapture:", {
        message: err.message,
        code: err.code,
        name: err.name,
        stack: err.stack,
        raw: err
      });
      // We only set 'denied' if something truly unexpected happens 
      // since the individual sensor failures above are caught.
      setPermissionStatus('denied');
    }
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
    isUnattended,
    setIsUnattended,
    showPrimer,
    setShowPrimer,
    permissionStatus,
    checkPermissions,
    handleContinueCapture
  };
}
