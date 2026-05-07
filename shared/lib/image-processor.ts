import EXIF from "exif-js";

export interface ProcessedImage {
  blob: Blob;
  previewUrl: string;
  metadata: {
    lat: number | null;
    lng: number | null;
    gps_time: number;
    accuracy: number | null;
    location_status:
      | "granted"
      | "timeout_unavailable"
      | "denied"
      | "unavailable"
      | "gallery"
      | "manual";
  };
}

const convertDMSToDD = (dms: any, ref: any): number | null => {
  if (!dms || !ref) return null;
  const degrees = dms[0];
  const minutes = dms[1];
  const seconds = dms[2];
  let dd = degrees + minutes / 60 + seconds / 3600;
  if (ref === "S" || ref === "W") dd = dd * -1;
  return dd;
};

export const processImage = async (
  file: File,
  isGallery: boolean = false
): Promise<ProcessedImage> => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    let lat: number | null = null;
    let lng: number | null = null;
    let accuracy: number | null = null;
    let location_status: ProcessedImage["metadata"]["location_status"] = "unavailable";

    let isFinalized = false;
    const finalizeProcessing = () => {
      if (isFinalized) return;
      isFinalized = true;

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        const MAX_SIZE = 1900;
        if (width > MAX_SIZE || height > MAX_SIZE) {
          if (width > height) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          } else {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Failed to get canvas context"));

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Canvas to Blob failed"));
            resolve({
              blob,
              previewUrl: URL.createObjectURL(blob),
              metadata: { lat, lng, gps_time: timestamp, accuracy, location_status },
            });
          },
          "image/jpeg",
          0.7 // Further reduced quality to hit ~500KB target at 1900px
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = objectUrl;
    };

    // New logic for gallery uploads: Try EXIF first
    if (isGallery) {
      location_status = "gallery";
      EXIF.getData(file as any, function (this: any) {
        const exifLat = EXIF.getTag(this, "GPSLatitude");
        const exifLatRef = EXIF.getTag(this, "GPSLatitudeRef");
        const exifLong = EXIF.getTag(this, "GPSLongitude");
        const exifLongRef = EXIF.getTag(this, "GPSLongitudeRef");

        if (exifLat && exifLong) {
          lat = convertDMSToDD(exifLat, exifLatRef);
          lng = convertDMSToDD(exifLong, exifLongRef);
          accuracy = 50; // Arbitrary accuracy for EXIF
          location_status = "granted";
        }
        finalizeProcessing();
      });

      // Timeout for EXIF processing
      setTimeout(() => {
        if (!isFinalized) finalizeProcessing();
      }, 2000);
    } else if ("geolocation" in navigator) {
      // Direct Camera logic
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
          accuracy = pos.coords.accuracy;
          location_status = "granted";
          finalizeProcessing();
        },
        (err) => {
          // If we have a permission denied, we mark it as such. 
          // Otherwise, we might have a timeout or other error.
          location_status = err.code === err.PERMISSION_DENIED ? "denied" : "timeout_unavailable";
          finalizeProcessing();
        },
        { 
          timeout: 5000, // Reduced to 5s for JIT speed
          maximumAge: 60000, // 60s cache is acceptable
          enableHighAccuracy: true 
        }
      );

      // Fallback timer
      setTimeout(() => {
        if (!isFinalized) {
          location_status = "timeout_unavailable";
          finalizeProcessing();
        }
      }, 5500);
    } else {
      finalizeProcessing();
    }
  });
};
