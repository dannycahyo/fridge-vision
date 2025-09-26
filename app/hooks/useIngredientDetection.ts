import { useState, useCallback } from 'react';
import type { Ingredient } from '~/types';

// Mock detected ingredients for UI demonstration
const mockDetectedIngredients: Ingredient[] = [
  { id: '1', name: 'tomato', confidence: 0.92, detected: true },
  { id: '2', name: 'egg', confidence: 0.87, detected: true },
  { id: '3', name: 'onion', confidence: 0.78, detected: true },
  { id: '4', name: 'cheese', confidence: 0.85, detected: true },
];

export function useIngredientDetection() {
  const [detectedIngredients, setDetectedIngredients] = useState<
    Ingredient[]
  >([]);
  const [manualIngredient, setManualIngredient] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  // Start ingredient detection (mock implementation)
  const startDetection = useCallback(() => {
    setIsDetecting(true);

    // TODO: Load TensorFlow.js model and start real-time detection
    // const model = await cocoSsd.load();
    // Implement real-time detection loop here

    // Mock detection after 2 seconds
    setTimeout(() => {
      setDetectedIngredients(mockDetectedIngredients);
      setIsDetecting(false);
    }, 2000);
  }, []);

  // Stop detection
  const stopDetection = useCallback(() => {
    setIsDetecting(false);
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
  }, []);

  return {
    detectedIngredients,
    manualIngredient,
    setManualIngredient,
    isDetecting,
    startDetection,
    stopDetection,
    removeIngredient,
    addManualIngredient,
    resetIngredients,
  };
}
