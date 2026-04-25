import { useState, useCallback, useEffect } from 'react';

export type PermissionState = 'prompt' | 'granted' | 'denied' | 'unavailable';

export function usePermissions() {
  const [cameraStatus, setCameraStatus] = useState<PermissionState>('prompt');
  const [locationStatus, setLocationStatus] = useState<PermissionState>('prompt');
  const [isSupported, setIsSupported] = useState(true);

  const checkStatus = useCallback(async () => {
    try {
      if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
        try {
          const camPerm = await (navigator.permissions as any).query({ name: 'camera' });
          setCameraStatus(camPerm.state as PermissionState);
          camPerm.addEventListener('change', () => {
            setCameraStatus(camPerm.state as PermissionState);
          });
        } catch {
          // Some browsers might not support 'camera' via permissions API
        }

        try {
          const geoPerm = await navigator.permissions.query({ name: 'geolocation' as any });
          setLocationStatus(geoPerm.state as PermissionState);
          geoPerm.addEventListener('change', () => {
            setLocationStatus(geoPerm.state as PermissionState);
          });
        } catch {
          // Fallback
        }
      } else {
        setIsSupported(false);
      }
    } catch (e) {
      console.warn("Permissions query check failed", e);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    let camSuccess = false;
    let geoSuccess = false;

    // 1. Camera
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setCameraStatus('granted');
        camSuccess = true;
      } else {
        setCameraStatus('unavailable');
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraStatus('denied');
      } else {
        setCameraStatus('unavailable');
      }
    }

    // 2. Geolocation (Quick trigger, don't wait for actual fix just the permission prompt)
    try {
      await new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            maximumAge: Infinity,
            timeout: 10000,
          });
        } else {
          reject(new Error('Geolocation not supported'));
        }
      });
      setLocationStatus('granted');
      geoSuccess = true;
    } catch (err: any) {
      if (err.code === 1) { // PERMISSION_DENIED
        setLocationStatus('denied');
      } else if (err.code === 3) { // TIMEOUT
        // Timeout means permission was granted (or prompt ignored), but no fix.
        // If prompt was ignored it might still be prompt. We rely on the permissions API to be accurate if possible.
        // But let's assume granted if it timed out trying to get a fix.
        if (locationStatus !== 'denied') setLocationStatus('granted');
        geoSuccess = true;
      } else {
        setLocationStatus('unavailable');
      }
    }

    return camSuccess || geoSuccess;
  }, [locationStatus]);

  return {
    cameraStatus,
    locationStatus,
    isSupported,
    requestPermissions,
    checkStatus
  };
}
