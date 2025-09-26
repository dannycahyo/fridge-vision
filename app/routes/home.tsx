import { Form, useNavigation, useActionData } from 'react-router';
import type { Route } from './+types/home';

// Custom Hooks
import { useCamera } from '~/hooks/useCamera';
import { useIngredientDetection } from '~/hooks/useIngredientDetection';
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

// Types
import type { Recipe } from '~/types';

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

// TODO: Implement action function for recipe generation
export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const ingredients =
      formData.get('ingredients')?.toString().split(',') || [];

    if (!ingredients || ingredients.length === 0) {
      return { error: 'No ingredients provided.' };
    }

    // TODO: Integrate with Gemini API
    // const prompt = `You are a creative chef. Create a recipe using: ${ingredients.join(', ')}. Format your response EXACTLY as follows...`;
    // const geminiResponse = await callGeminiAPI(prompt, process.env.GEMINI_API_KEY);

    // Mock recipe for UI demonstration
    const mockRecipe: Recipe = {
      dishName: 'Mediterranean Veggie Scramble',
      ingredients: ingredients,
      instructions: [
        'Heat a large skillet over medium heat and add a drizzle of olive oil.',
        'Add diced onions and cook until translucent, about 3-4 minutes.',
        'Add tomatoes and cook until they start to soften.',
        'Beat eggs in a bowl and pour into the skillet.',
        'Gently scramble the eggs with the vegetables until just set.',
        'Season with salt, pepper, and fresh herbs.',
        'Serve immediately while hot.',
      ],
    };

    return { recipe: mockRecipe };
  } catch (error) {
    console.error('Action Error:', error);
    return { error: 'Failed to generate recipe.' };
  }
}

export default function Home() {
  // Custom hooks
  const { cameraStatus, error: cameraError, requestCameraPermission, resetCamera } = useCamera();
  const {
    detectedIngredients,
    manualIngredient,
    setManualIngredient,
    isDetecting,
    startDetection,
    stopDetection,
    removeIngredient,
    addManualIngredient,
    resetIngredients,
  } = useIngredientDetection();
  const { currentStep, isSubmitting, recipe, apiError, goToStep, startOver } = useAppFlow();

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
        {apiError && <ErrorDisplay error={apiError} />}

        {/* Screen Components */}
        {currentStep === 'welcome' && (
          <WelcomeScreen cameraStatus={cameraStatus} onStartScanning={handleStartScanning} />
        )}

        {currentStep === 'camera' && cameraStatus === 'granted' && (
          <CameraScreen
            isDetecting={isDetecting}
            detectedIngredients={detectedIngredients}
            onStartDetection={startDetection}
            onStopDetection={stopDetection}
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
          <GenerationScreen detectedIngredients={detectedIngredients} isSubmitting={isSubmitting} />
        )}

        {currentStep === 'recipe' && recipe && (
          <RecipeScreen recipe={recipe} onStartOver={handleStartOver} />
        )}
      </div>
    </div>
  );
}
