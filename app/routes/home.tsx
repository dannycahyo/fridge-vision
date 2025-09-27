import type { Route } from './+types/home';

import { useCamera } from '~/hooks/useCamera';
import { useIngredientDetection } from '~/hooks/useIngredientDetection';
import { useAppFlow } from '~/hooks/useAppFlow';

import { WelcomeScreen } from '~/components/screens/WelcomeScreen';
import { CameraScreen } from '~/components/screens/CameraScreen';
import { ConfirmationScreen } from '~/components/screens/ConfirmationScreen';
import { GenerationScreen } from '~/components/screens/GenerationScreen';
import { RecipeScreen } from '~/components/screens/RecipeScreen';

import { ProgressIndicator } from '~/components/ui/ProgressIndicator';
import { ErrorDisplay } from '~/components/ui/ErrorDisplay';

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

    if (actionType === 'analyzeImage') {
      const imageFile = formData.get('image') as File;

      if (!imageFile) {
        return { error: 'No image provided for analysis.' };
      }

      const arrayBuffer = await imageFile.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);

      const { analyzeImageForIngredients } = await import(
        '~/lib/googleVision'
      );

      const result = await analyzeImageForIngredients(imageBuffer);

      if (result.error) {
        return { error: result.error };
      }

      return { detectedIngredients: result.ingredients };
    } else {
      // Handle recipe generation
      const ingredients =
        formData.get('ingredients')?.toString().split(',') || [];

      if (!ingredients || ingredients.length === 0) {
        return { error: 'No ingredients provided.' };
      }

      const { generateRecipe } = await import('~/lib/gemini');

      const recipe = await generateRecipe(ingredients);

      return { recipe };
    }
  } catch (error) {
    console.error('Action Error:', error);
    return { error: 'Failed to process request. Please try again.' };
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
    isAnalyzing,
    error: detectionError,
    analyzeCurrentFrame,
    setVideoRef,
    removeIngredient,
    addManualIngredient,
    resetIngredients,
  } = useIngredientDetection();
  const {
    currentStep,
    isSubmitting,
    recipe,
    apiError,
    goToStep,
    startOver,
  } = useAppFlow();

  const handleStartScanning = async () => {
    const success = await requestCameraPermission();
    if (success) {
      goToStep('camera');
    }
  };

  const handleStopDetectionAndConfirm = () => {
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
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ChefHat className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              FridgeVision AI
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Turn your fridge into culinary inspiration
          </p>
        </div>

        <ProgressIndicator currentStep={currentStep} />

        {cameraError && <ErrorDisplay error={cameraError} />}
        {detectionError && <ErrorDisplay error={detectionError} />}
        {apiError && <ErrorDisplay error={apiError} />}

        {currentStep === 'welcome' && (
          <WelcomeScreen
            cameraStatus={cameraStatus}
            onStartScanning={handleStartScanning}
          />
        )}

        {currentStep === 'camera' && cameraStatus === 'granted' && (
          <CameraScreen
            isAnalyzing={isAnalyzing}
            detectedIngredients={detectedIngredients}
            error={detectionError}
            onCaptureAndAnalyze={analyzeCurrentFrame}
            onConfirm={handleStopDetectionAndConfirm}
            onSetVideoRef={setVideoRef}
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
