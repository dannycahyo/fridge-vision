import { useState, useCallback, useRef, useEffect } from 'react';
import {
  useSubmit,
  useActionData,
  useNavigation,
} from 'react-router';
import { captureImageFromVideo } from '~/lib/vision-api-server';
import type { Ingredient } from '~/types';

interface VisionIngredient {
  name: string;
  confidence: number;
  category: 'food' | 'object';
}

export function useServerVisionIngredientDetection() {
  const [detectedIngredients, setDetectedIngredients] = useState<
    Ingredient[]
  >([]);
  const [manualIngredient, setManualIngredient] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastDetectionTime = useRef<number>(0);
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData() as
    | {
        detectedIngredients?: VisionIngredient[];
        error?: string;
      }
    | undefined;

  // Check if we're currently processing a detection request
  const isProcessing =
    navigation.state === 'submitting' &&
    navigation.formData?.get('actionType') === 'detect-ingredients';

  // Handle action data when it comes back from the server
  useEffect(() => {
    if (actionData) {
      if (actionData.error) {
        setError(actionData.error);
      } else if (actionData.detectedIngredients) {
        // Convert Vision API results to our ingredient format
        const newIngredients: Ingredient[] =
          actionData.detectedIngredients.map(
            (item: VisionIngredient, index: number) => ({
              id: `vision-${Date.now()}-${index}`,
              name: item.name,
              confidence: item.confidence,
              detected: true,
            }),
          );

        // Add new ingredients, avoiding duplicates
        setDetectedIngredients((prev) => {
          const existingNames = new Set(
            prev.map((ing) => ing.name.toLowerCase()),
          );
          const uniqueNew = newIngredients.filter(
            (ing) => !existingNames.has(ing.name.toLowerCase()),
          );

          if (uniqueNew.length > 0) {
            console.log(
              `Detected ${uniqueNew.length} new ingredients:`,
              uniqueNew.map(
                (ing) =>
                  `${ing.name} (${Math.round((ing.confidence || 0) * 100)}%)`,
              ),
            );
            return [...prev, ...uniqueNew];
          }
          return prev;
        });

        setError(null); // Clear any previous errors
      }
    }
  }, [actionData]);

  // Server-side ingredient detection via React Router action
  const detectIngredients = useCallback(
    async (videoElement: HTMLVideoElement) => {
      // Throttle requests (max once per 5 seconds)
      const now = Date.now();
      if (now - lastDetectionTime.current < 5000) {
        console.log(
          'Detection throttled - wait 5 seconds between detections',
        );
        return;
      }

      try {
        setError(null);
        lastDetectionTime.current = now;

        // Capture image from video
        const imageBase64 = captureImageFromVideo(videoElement);

        // Submit to server action using React Router
        const formData = new FormData();
        formData.append('actionType', 'detect-ingredients');
        formData.append('imageData', imageBase64);

        submit(formData, { method: 'POST' });

        console.log('Submitted detection request to server');
      } catch (err) {
        console.error('Detection failed:', err);
        setError(
          err instanceof Error ? err.message : 'Detection failed',
        );
      }
    },
    [submit],
  );

  // Start detection session
  const startDetection = useCallback(
    (videoElement?: HTMLVideoElement) => {
      if (!videoElement) {
        setError(
          'Camera not available. Please ensure camera access is granted.',
        );
        return;
      }

      setIsDetecting(true);
      setError(null);

      // Initial detection
      detectIngredients(videoElement);

      console.log('Started Vision API ingredient detection');
    },
    [detectIngredients],
  );

  // Stop detection session
  const stopDetection = useCallback(() => {
    setIsDetecting(false);
    console.log('Stopped ingredient detection');
  }, []);

  // Manually trigger detection
  const triggerDetection = useCallback(
    (videoElement?: HTMLVideoElement) => {
      if (!videoElement) {
        setError('Camera not available for detection.');
        return;
      }

      detectIngredients(videoElement);
    },
    [detectIngredients],
  );

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
        id: Date.now().toString(),
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
    setIsDetecting(false);
    setError(null);
    lastDetectionTime.current = 0;
  }, []);

  // Check if ready for next detection
  const canDetect = useCallback(() => {
    const now = Date.now();
    return !isProcessing && now - lastDetectionTime.current >= 5000;
  }, [isProcessing]);

  return {
    detectedIngredients,
    manualIngredient,
    setManualIngredient,
    isDetecting,
    isProcessing,
    isInitialized: true, // Always ready since no model loading required
    error,
    startDetection,
    stopDetection,
    triggerDetection,
    removeIngredient,
    addManualIngredient,
    resetIngredients,
    canDetect,
  };
}
