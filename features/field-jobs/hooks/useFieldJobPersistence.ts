import { useEffect } from "react";
import { fieldStorage } from "../../../shared/lib/storage";
import { Job } from "../../../entities/job/types";

export function useFieldJobPersistence(
  job: Job | undefined, 
  isDevMode: boolean, 
  processedPhotos: any[], 
  signatureData: string | null
) {
  // Sync Photos to persistence
  useEffect(() => {
    if (!isDevMode || !job || processedPhotos.length === 0) return;

    const syncPhotos = async () => {
      const fieldCaptures = (await fieldStorage.getItem(`field_captures_${job.id}`)) || 
        JSON.parse(sessionStorage.getItem(`field_captures_${job.id}`) || '{"photos": [], "proofs": [], "signature": null}');

      const photoPromises = processedPhotos.map((p) => {
        if (p.previewUrl.startsWith('data:')) return Promise.resolve({ base64: p.previewUrl, metadata: p.metadata });
        
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
      fieldCaptures.photos = base64Photos.map((p) => p.base64);
      fieldCaptures.proofs = base64Photos.map((p) => ({
        url: p.base64,
        gps_time: p.metadata.gps_time,
        lat: p.metadata.lat,
        lng: p.metadata.lng,
        accuracy: p.metadata.accuracy,
        location_status: p.metadata.location_status,
      }));

      await fieldStorage.setItem(`field_captures_${job.id}`, fieldCaptures);
      window.dispatchEvent(new Event("field_capture_update"));
    };

    syncPhotos();
  }, [processedPhotos, isDevMode, job]);

  // Sync Signature to persistence
  useEffect(() => {
    if (!isDevMode || !job || !signatureData) return;

    const syncSignature = async () => {
      const fieldCaptures = (await fieldStorage.getItem(`field_captures_${job.id}`)) || 
        JSON.parse(sessionStorage.getItem(`field_captures_${job.id}`) || '{"photos": [], "proofs": [], "signature": null}');
      
      fieldCaptures.signature = signatureData;
      await fieldStorage.setItem(`field_captures_${job.id}`, fieldCaptures);
      window.dispatchEvent(new Event("field_capture_update"));
    };
    syncSignature();
  }, [signatureData, isDevMode, job]);
}
