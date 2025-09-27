import type { Route } from './+types/home';

import { useCamera } from '~/hooks/useCamera';
import { useServerVisionIngredientDetection } from '~/hooks/useServerVisionIngredientDetection';
import { useAppFlow } from '~/hooks/useAppFlow';

// Screen Components
import { WelcomeScreen } from '~/components/screens/WelcomeScreen';
import { CameraScreen } from '~/components/screens/CameraScreen';
import { ConfirmationScreen } from '~/components/screens/ConfirmationScreen';
import { GenerationScreen } from '~/components/screens/GenerationScreen';
import { RecipeScreen } from '~/components/screens/RecipeScreen';

// UI Components
import { ProgressIndicator } from '~/components/ui/ProgressIndicator';
import { ErrorDisplay } from '~/components/ui/ErrorDisplay';

// Icons
import { ChefHat } from 'lucide-react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'FridgeVision AI - Smart Recipe Generator' },
    {
      name: 'description',
      content:
        'Turn your fridge contents into delicious recipes using AI-powered ingredient detection and recipe generation.',
    },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const actionType = formData.get('actionType')?.toString();

    // Handle Vision API ingredient detection
    if (actionType === 'detect-ingredients') {
      const imageData = formData.get('imageData')?.toString();

      if (!imageData) {
        return { error: 'No image data provided for detection.' };
      }

      const { detectIngredientsFromImage } = await import(
        '~/lib/vision-api-server'
      );

      // Detect ingredients using Vision API
      const detectedIngredients =
        await detectIngredientsFromImage(imageData);

      return { detectedIngredients };
    }

    // Handle recipe generation (existing functionality)
    if (actionType === 'generate-recipe') {
      const ingredients =
        formData.get('ingredients')?.toString().split(',') || [];

      if (!ingredients || ingredients.length === 0) {
        return { error: 'No ingredients provided.' };
      }

      // Import Gemini API function
      const { generateRecipe } = await import('~/lib/gemini');

      // Generate recipe using Gemini API
      const recipe = await generateRecipe(ingredients);

      return { recipe };
    }

    return { error: 'Invalid action type.' };
  } catch (error) {
    console.error('Action Error:', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.',
    };
  }
}

export default function Home() {
  const {
    cameraStatus,
    error: cameraError,
    requestCameraPermission,
    resetCamera,
  } = useCamera();
  const {
    detectedIngredients,
    manualIngredient,
    setManualIngredient,
    isDetecting,
    isInitialized,
    isProcessing,
    error: detectionError,
    startDetection,
    stopDetection,
    triggerDetection,
    removeIngredient,
    addManualIngredient,
    resetIngredients,
    canDetect,
  } = useServerVisionIngredientDetection();
  const {
    currentStep,
    isSubmitting,
    recipe,
    apiError,
    goToStep,
    startOver,
  } = useAppFlow();

  // Event handlers
  const handleStartScanning = async () => {
    const success = await requestCameraPermission();
    if (success) {
      goToStep('camera');
    }
  };

  const handleStopDetectionAndConfirm = () => {
    stopDetection();
    goToStep('confirming');
  };

  const handleProceedToGeneration = () => {
    if (detectedIngredients.length > 0) {
      goToStep('generating');
    }
  };

  const handleStartOver = () => {
    startOver();
    resetCamera();
    resetIngredients();
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ChefHat className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              FridgeVision AI
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Turn your fridge into culinary inspiration
          </p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator currentStep={currentStep} />

        {/* Error Displays */}
        {cameraError && <ErrorDisplay error={cameraError} />}
        {detectionError && <ErrorDisplay error={detectionError} />}
        {apiError && <ErrorDisplay error={apiError} />}

        {/* Screen Components */}
        {currentStep === 'welcome' && (
          <WelcomeScreen
            cameraStatus={cameraStatus}
            onStartScanning={handleStartScanning}
          />
        )}

        {currentStep === 'camera' && cameraStatus === 'granted' && (
          <CameraScreen
            isDetecting={isDetecting}
            isProcessing={isProcessing}
            isInitialized={isInitialized}
            detectedIngredients={detectedIngredients}
            detectionError={detectionError}
            canDetect={canDetect()}
            onStartDetection={startDetection}
            onStopDetection={stopDetection}
            onTriggerDetection={triggerDetection}
            onConfirm={handleStopDetectionAndConfirm}
          />
        )}

        {currentStep === 'confirming' && (
          <ConfirmationScreen
            detectedIngredients={detectedIngredients}
            manualIngredient={manualIngredient}
            onManualIngredientChange={setManualIngredient}
            onRemoveIngredient={removeIngredient}
            onAddManualIngredient={addManualIngredient}
            onBackToCamera={() => goToStep('camera')}
            onProceedToGeneration={handleProceedToGeneration}
          />
        )}

        {currentStep === 'generating' && (
          <GenerationScreen
            detectedIngredients={detectedIngredients}
            isSubmitting={isSubmitting}
          />
        )}

        {currentStep === 'recipe' && recipe && (
          <RecipeScreen
            recipe={recipe}
            onStartOver={handleStartOver}
          />
        )}
      </div>
    </div>
  );
}
