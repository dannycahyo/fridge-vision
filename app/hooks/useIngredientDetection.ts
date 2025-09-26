import { useState, useCallback, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import type { Ingredient } from '~/types';

interface Detection {
  bbox: number[];
  class: string;
  score: number;
}

export function useIngredientDetection() {
  const [detectedIngredients, setDetectedIngredients] = useState<
    Ingredient[]
  >([]);
  const [manualIngredient, setManualIngredient] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDetections, setCurrentDetections] = useState<
    Detection[]
  >([]);

  const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load TensorFlow.js model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        setError(null);
        // Initialize TensorFlow.js backend
        await tf.ready();

        // Load COCO-SSD model
        const model = await cocoSsd.load();
        modelRef.current = model;
        setModelLoaded(true);
        console.log('TensorFlow.js model loaded successfully');
      } catch (err) {
        console.error('Failed to load TensorFlow.js model:', err);
        setError(
          'Failed to load AI model. Please refresh the page and try again.',
        );
      }
    };

    loadModel();

    // Cleanup on unmount
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  // Convert detection results to ingredients
  const processDetections = useCallback((detections: Detection[]) => {
    // Process all detections in the current frame
    const currentFrameIngredients: Ingredient[] = [];

    detections.forEach((detection, index) => {
      const className = detection.class.toLowerCase();

      // Lower confidence threshold - let users decide what's relevant
      if (detection.score < 0.3) return;

      // Create ingredient for each detected object (including multiples of same type)
      const ingredient: Ingredient = {
        id: `detected-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        name: className,
        confidence: detection.score,
        detected: true,
      };

      currentFrameIngredients.push(ingredient);
    });

    // Add new ingredients, but avoid duplicates by name (not by individual detection)
    if (currentFrameIngredients.length > 0) {
      setDetectedIngredients((prev) => {
        const existingNames = new Set(prev.map((ing) => ing.name));
        const uniqueNew = currentFrameIngredients.filter(
          (ing) => !existingNames.has(ing.name),
        );

        // If we have new unique ingredients, add them
        if (uniqueNew.length > 0) {
          return [...prev, ...uniqueNew];
        }

        return prev;
      });
    }
  }, []);

  // Perform detection on webcam frame
  const detectObjects = useCallback(
    async (videoElement: HTMLVideoElement) => {
      if (!modelRef.current || !videoElement) return;

      try {
        const predictions =
          await modelRef.current.detect(videoElement);

        // Accept ALL detections - let users curate the list themselves
        const allDetections = predictions.filter(
          (pred) => pred.score > 0.3, // Lower threshold for broader detection
        );

        // Update current detections for overlay
        setCurrentDetections(allDetections as Detection[]);

        if (allDetections.length > 0) {
          processDetections(allDetections as Detection[]);
        }
      } catch (err) {
        console.error('Detection error:', err);
      }
    },
    [processDetections],
  );

  // Start detection with webcam
  const startDetection = useCallback(
    (videoElement?: HTMLVideoElement) => {
      if (!modelLoaded || !modelRef.current) {
        setError(
          'AI model is not loaded yet. Please wait a moment and try again.',
        );
        return;
      }

      if (!videoElement) {
        setError(
          'Camera not available. Please ensure camera access is granted.',
        );
        return;
      }

      setIsDetecting(true);
      setError(null);

      // Start detection loop
      detectionIntervalRef.current = setInterval(() => {
        detectObjects(videoElement);
      }, 1500); // Detect every 1.5 seconds for better responsiveness

      console.log('Started real-time ingredient detection');
    },
    [modelLoaded, detectObjects],
  );

  // Stop detection
  const stopDetection = useCallback(() => {
    setIsDetecting(false);
    setCurrentDetections([]);
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    console.log('Stopped ingredient detection');
  }, []);

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

  // Reset all ingredients
  const resetIngredients = useCallback(() => {
    setDetectedIngredients([]);
    setManualIngredient('');
    setIsDetecting(false);
    setCurrentDetections([]);
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  }, []);

  return {
    detectedIngredients,
    manualIngredient,
    setManualIngredient,
    isDetecting,
    modelLoaded,
    error,
    currentDetections,
    startDetection,
    stopDetection,
    removeIngredient,
    addManualIngredient,
    resetIngredients,
  };
}
