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
import { Camera, CheckCircle, Loader2 } from 'lucide-react';
import type { Ingredient } from '~/types';

interface CameraScreenProps {
  isDetecting: boolean;
  detectedIngredients: Ingredient[];
  onStartDetection: () => void;
  onStopDetection: () => void;
  onConfirm: () => void;
}

export function CameraScreen({
  isDetecting,
  detectedIngredients,
  onStartDetection,
  onStopDetection,
  onConfirm,
}: CameraScreenProps) {
  const webcamRef = useRef<Webcam>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <Camera className="h-5 w-5" />
          Scan Your Ingredients
        </CardTitle>
        <CardDescription className="text-center">
          {isDetecting
            ? 'Detecting ingredients...'
            : 'Point your camera at your fridge contents'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
          {/* TODO: Add detection overlay with bounding boxes */}
          {isDetecting && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white rounded-lg p-4 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">
                  Detecting ingredients...
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
            <Button onClick={onStartDetection} className="flex-1">
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
                onClick={onStartDetection}
                variant="outline"
                className="flex-1"
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
