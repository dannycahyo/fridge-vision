import { useState, useCallback } from 'react';
import type { CameraStatus } from '~/types';

export function useCamera() {
  const [cameraStatus, setCameraStatus] =
    useState<CameraStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const requestCameraPermission = useCallback(async () => {
    setCameraStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      stream.getTracks().forEach((track) => track.stop()); // Stop the stream
      setCameraStatus('granted');
      return true;
    } catch (err) {
      setCameraStatus('denied');
      setError(
        'Camera permission is required to detect ingredients. Please enable camera access in your browser settings.',
      );
      return false;
    }
  }, []);

  const resetCamera = useCallback(() => {
    setCameraStatus('idle');
    setError(null);
  }, []);

  return {
    cameraStatus,
    error,
    requestCameraPermission,
    resetCamera,
  };
}
