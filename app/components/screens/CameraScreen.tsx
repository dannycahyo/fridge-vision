import { useRef } from 'react';
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
import { DetectionOverlay } from '~/components/ui/DetectionOverlay';
import { Camera, CheckCircle, Loader2 } from 'lucide-react';
import type { Ingredient } from '~/types';

interface CameraScreenProps {
  isDetecting: boolean;
  detectedIngredients: Ingredient[];
  currentDetections: Array<{
    bbox: number[];
    class: string;
    score: number;
  }>;
  modelLoaded: boolean;
  detectionError?: string | null;
  onStartDetection: (videoElement?: HTMLVideoElement) => void;
  onStopDetection: () => void;
  onConfirm: () => void;
}

export function CameraScreen({
  isDetecting,
  detectedIngredients,
  currentDetections,
  modelLoaded,
  detectionError,
  onStartDetection,
  onStopDetection,
  onConfirm,
}: CameraScreenProps) {
  const webcamRef = useRef<Webcam>(null);

  const handleStartDetection = () => {
    const videoElement = webcamRef.current?.video;
    onStartDetection(videoElement || undefined);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <Camera className="h-5 w-5" />
          Scan Your Ingredients
        </CardTitle>
        <CardDescription className="text-center">
          {!modelLoaded
            ? 'Loading AI model...'
            : isDetecting
              ? 'Detecting everything visible...'
              : 'Point your camera at anything - food, containers, kitchen items'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info Box */}
        {!isDetecting && detectedIngredients.length === 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              💡 <strong>Tip:</strong> The camera will detect
              everything visible - fruits, vegetables, containers,
              utensils, and more. You'll curate the final ingredient
              list in the next step!
            </p>
          </div>
        )}

        {/* Error display */}
        {detectionError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">{detectionError}</p>
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
          {/* Detection Overlay */}
          <DetectionOverlay
            detections={currentDetections}
            videoWidth={720}
            videoHeight={480}
            isVisible={isDetecting && modelLoaded}
          />
          {/* Loading Overlay */}
          {(isDetecting || !modelLoaded) && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white rounded-lg p-4 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">
                  {!modelLoaded
                    ? 'Loading AI model...'
                    : 'Detecting everything in view...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Detection Status */}
        <div className="text-center space-y-2">
          {detectedIngredients.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center">
              {detectedIngredients.map((ingredient) => (
                <Badge
                  key={ingredient.id}
                  variant="secondary"
                  className="text-xs"
                >
                  {ingredient.name}
                  {ingredient.confidence && (
                    <span className="ml-1 text-green-600">
                      {Math.round(ingredient.confidence * 100)}%
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isDetecting && detectedIngredients.length === 0 && (
            <Button
              onClick={handleStartDetection}
              className="flex-1"
              disabled={!modelLoaded}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Start Detection
            </Button>
          )}
          {isDetecting && (
            <Button
              onClick={onStopDetection}
              variant="outline"
              className="flex-1"
            >
              Stop Detection
            </Button>
          )}
          {detectedIngredients.length > 0 && !isDetecting && (
            <>
              <Button
                onClick={handleStartDetection}
                variant="outline"
                className="flex-1"
                disabled={!modelLoaded}
              >
                Scan More
              </Button>
              <Button onClick={onConfirm} className="flex-1">
                Confirm ({detectedIngredients.length})
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
