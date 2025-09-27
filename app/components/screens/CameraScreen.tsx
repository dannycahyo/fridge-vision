import { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Camera, CheckCircle, Loader2, Scan } from 'lucide-react';
import type { Ingredient } from '~/types';

interface CameraScreenProps {
  isAnalyzing: boolean;
  detectedIngredients: Ingredient[];
  error?: string | null;
  onCaptureAndAnalyze: () => void;
  onConfirm: () => void;
  onSetVideoRef: (video: HTMLVideoElement | null) => void;
}

export function CameraScreen({
  isAnalyzing,
  detectedIngredients,
  error,
  onCaptureAndAnalyze,
  onConfirm,
  onSetVideoRef,
}: CameraScreenProps) {
  const webcamRef = useRef<Webcam>(null);

  // Set video reference when webcam is ready
  useEffect(() => {
    if (webcamRef.current?.video) {
      onSetVideoRef(webcamRef.current.video);
    }
    return () => onSetVideoRef(null);
  }, [onSetVideoRef]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <Camera className="h-5 w-5" />
          Capture Your Ingredients
        </CardTitle>
        <CardDescription className="text-center">
          {isAnalyzing
            ? 'Analyzing image for ingredients...'
            : 'Point your camera at your ingredients and take a photo to analyze'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info Box */}
        {!isAnalyzing && detectedIngredients.length === 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              � <strong>Tip:</strong> Take a clear photo of your
              ingredients. The AI will analyze the image and detect
              food items, labels, and text to identify what
              ingredients you have available.
            </p>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Camera View */}
        <div className="relative rounded-lg overflow-hidden bg-gray-100">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-64 object-cover"
            videoConstraints={{
              width: 720,
              height: 480,
              facingMode: 'environment',
            }}
          />
          {/* Analysis Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white rounded-lg p-4 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm font-medium text-gray-900">
                  Analyzing ingredients...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Detected Ingredients */}
        {detectedIngredients.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-center text-gray-900 dark:text-gray-100">
              Detected Ingredients:
            </h3>
            <div className="flex flex-wrap gap-1 justify-center">
              {detectedIngredients.map((ingredient) => (
                <Badge
                  key={ingredient.id}
                  variant="secondary"
                  className="text-xs"
                >
                  {ingredient.name}
                  {ingredient.confidence && (
                    <span className="ml-1 text-green-600 font-medium">
                      {Math.round(ingredient.confidence * 100)}%
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={onCaptureAndAnalyze}
            className="flex-1"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Scan className="mr-2 h-4 w-4" />
                {detectedIngredients.length > 0
                  ? 'Capture More'
                  : 'Capture & Analyze'}
              </>
            )}
          </Button>

          {detectedIngredients.length > 0 && !isAnalyzing && (
            <Button
              onClick={onConfirm}
              variant="default"
              className="flex-1"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm ({detectedIngredients.length})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
