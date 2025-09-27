import { useState, useCallback, useRef, useEffect } from 'react';
import { useFetcher } from 'react-router';
import type { Ingredient } from '~/types';

export function useIngredientDetection() {
  const [detectedIngredients, setDetectedIngredients] = useState<
    Ingredient[]
  >([]);
  const [manualIngredient, setManualIngredient] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetcher = useFetcher<{
    detectedIngredients?: Ingredient[];
    error?: string;
  }>();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Handle the fetcher response
  const handleFetcherData = useCallback(() => {
    if (fetcher.data) {
      setIsAnalyzing(false);

      if (fetcher.data.error) {
        setError(fetcher.data.error);
      } else if (fetcher.data.detectedIngredients) {
        // Add new detected ingredients to the existing list
        setDetectedIngredients((prev) => {
          const existingNames = new Set(prev.map((ing) => ing.name));
          const uniqueNew =
            fetcher.data?.detectedIngredients?.filter(
              (ing) => !existingNames.has(ing.name),
            ) || [];

          if (uniqueNew.length > 0) {
            console.log(
              `Added ${uniqueNew.length} new ingredients:`,
              uniqueNew.map((i) => i.name),
            );
          }

          return [...prev, ...uniqueNew];
        });
        setError(null);
      }
    }
  }, [fetcher.data]);

  // Call handleFetcherData whenever fetcher.data changes
  useEffect(() => {
    handleFetcherData();
  }, [handleFetcherData]);

  // Capture image from video and send for analysis
  const captureAndAnalyze = useCallback(
    (videoElement: HTMLVideoElement) => {
      if (!videoElement) {
        setError(
          'Camera not available. Please ensure camera access is granted.',
        );
        return;
      }

      setIsAnalyzing(true);
      setError(null);

      try {
        // Create canvas to capture video frame
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Could not create canvas context');
        }

        // Draw current video frame to canvas
        context.drawImage(videoElement, 0, 0);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setError('Failed to capture image. Please try again.');
              setIsAnalyzing(false);
              return;
            }

            // Create form data with the image
            const formData = new FormData();
            formData.append('actionType', 'analyzeImage');
            formData.append('image', blob, 'capture.jpg');

            // Submit to server action
            fetcher.submit(formData, {
              method: 'post',
              encType: 'multipart/form-data',
            });
          },
          'image/jpeg',
          0.8,
        );
      } catch (err) {
        console.error('Image capture error:', err);
        setError('Failed to capture image. Please try again.');
        setIsAnalyzing(false);
      }
    },
    [fetcher],
  );

  // Set video reference for capture
  const setVideoRef = useCallback(
    (video: HTMLVideoElement | null) => {
      videoRef.current = video;
    },
    [],
  );

  // Analyze current video frame
  const analyzeCurrentFrame = useCallback(() => {
    if (videoRef.current) {
      captureAndAnalyze(videoRef.current);
    } else {
      setError(
        'No camera feed available. Please ensure camera is active.',
      );
    }
  }, [captureAndAnalyze]);

  // Remove ingredient from detected list
  const removeIngredient = useCallback((id: string) => {
    setDetectedIngredients((prev) =>
      prev.filter((ing) => ing.id !== id),
    );
  }, []);

  // Add manual ingredient
  const addManualIngredient = useCallback(() => {
    if (manualIngredient.trim()) {
      const newIngredient: Ingredient = {
        id: `manual-${Date.now()}`,
        name: manualIngredient.trim().toLowerCase(),
        detected: false,
      };
      setDetectedIngredients((prev) => [...prev, newIngredient]);
      setManualIngredient('');
    }
  }, [manualIngredient]);

  // Reset all ingredients and state
  const resetIngredients = useCallback(() => {
    setDetectedIngredients([]);
    setManualIngredient('');
    setIsAnalyzing(false);
    setError(null);
    // Reset fetcher state if needed
    if (fetcher.state !== 'idle') {
      // The fetcher will reset itself when the next navigation occurs
    }
  }, [fetcher.state]);

  return {
    detectedIngredients,
    manualIngredient,
    setManualIngredient,
    isAnalyzing, // Changed from isDetecting to isAnalyzing
    error,
    analyzeCurrentFrame, // New method to trigger analysis
    setVideoRef, // New method to set video reference
    removeIngredient,
    addManualIngredient,
    resetIngredients,
    isSubmitting: fetcher.state === 'submitting', // Expose fetcher state
  };
}
