export interface ProcessedImage {
  blob: Blob;
  previewUrl: string;
  metadata: {
    lat: number | null;
    lng: number | null;
    timestamp: number;
    isGpsLocked: boolean;
  };
}

export const processImage = async (file: File): Promise<ProcessedImage> => {
  return new Promise((resolve, reject) => {
    // 1. Capture metadata timestamp
    const timestamp = Date.now();

    // 2. Extract Geolocation (timeout after 5 seconds)
    let lat: number | null = null;
    let lng: number | null = null;
    let isGpsLocked = false;
    
    let isFinalized = false;
    const finalizeProcessing = () => {
      if (isFinalized) return;
      isFinalized = true;

      // 3. Load image to Canvas for downscaling
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        const MAX_WIDTH = 1900;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Failed to get canvas context'));
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // 4. Output as 0.8 quality JPEG
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Canvas to Blob failed'));
            resolve({
              blob,
              previewUrl: URL.createObjectURL(blob),
              metadata: { lat, lng, timestamp, isGpsLocked }
            });
          },
          'image/jpeg',
          0.8
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = objectUrl;
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
          isGpsLocked = true;
          finalizeProcessing();
        },
        (_err) => {
          isGpsLocked = false;
          finalizeProcessing(); // Proceed without geolocation
        },
        { 
          timeout: 5000, 
          maximumAge: 10000,
          enableHighAccuracy: true 
        }
      );
      
      // Safety timeout: If GPS takes > 5s, we proceed with whatever we have (likely null)
      // but ensure we don't hang the camera
      setTimeout(() => {
        if (!isFinalized) {
          finalizeProcessing();
        }
      }, 5500);
    } else {
      finalizeProcessing();
    }
  });
};
