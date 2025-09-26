import { useState, useCallback, useEffect } from 'react';
import { useNavigation, useActionData } from 'react-router';
import type { AppStep, Recipe } from '~/types';

export function useAppFlow() {
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const navigation = useNavigation();
  const actionData = useActionData<{
    recipe?: Recipe;
    error?: string;
  }>();

  const isSubmitting = navigation.state === 'submitting';
  const recipe = actionData?.recipe;
  const apiError = actionData?.error;

  // Move to specific step
  const goToStep = useCallback((step: AppStep) => {
    setCurrentStep(step);
  }, []);

  // Start over from beginning
  const startOver = useCallback(() => {
    setCurrentStep('welcome');
  }, []);

  // Auto-navigate to recipe step when recipe is received
  useEffect(() => {
    if (recipe && !isSubmitting) {
      setCurrentStep('recipe');
    }
  }, [recipe, isSubmitting]);

  return {
    currentStep,
    isSubmitting,
    recipe,
    apiError,
    goToStep,
    startOver,
  };
}
