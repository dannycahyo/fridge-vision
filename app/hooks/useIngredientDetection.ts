import { useState, useCallback, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import type { Ingredient } from '~/types';

// All COCO-SSD detectable classes - let the camera see everything!

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
  const detectedClassesRef = useRef<Set<string>>(new Set());

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
    const newIngredients: Ingredient[] = [];

    detections.forEach((detection, index) => {
      const className = detection.class.toLowerCase();

      // Lower confidence threshold - let users decide what's relevant
      if (detection.score < 0.3) return;

      // Map class name to ingredient name (or keep as-is)
      const mappedName = className;

      // Skip if we've already detected this class recently
      if (detectedClassesRef.current.has(mappedName)) return;

      // Add to detected classes to avoid duplicates
      detectedClassesRef.current.add(mappedName);

      const ingredient: Ingredient = {
        id: `detected-${Date.now()}-${index}`,
        name: mappedName,
        confidence: detection.score,
        detected: true,
      };

      newIngredients.push(ingredient);
    });

    // Update ingredients state
    if (newIngredients.length > 0) {
      setDetectedIngredients((prev) => {
        const existingNames = new Set(prev.map((ing) => ing.name));
        const uniqueNew = newIngredients.filter(
          (ing) => !existingNames.has(ing.name),
        );
        return [...prev, ...uniqueNew];
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
      detectedClassesRef.current.clear();

      // Start detection loop
      detectionIntervalRef.current = setInterval(() => {
        detectObjects(videoElement);
      }, 2000); // Detect every 2 seconds

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
    detectedClassesRef.current.clear();
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
