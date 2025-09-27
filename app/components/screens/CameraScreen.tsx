import { useEffect, useRef } from 'react';
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
import { Separator } from '~/components/ui/separator';
import {
  Camera,
  Scan,
  CheckCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { Ingredient } from '~/types';

interface CameraScreenProps {
  isDetecting: boolean;
  isProcessing: boolean;
  isInitialized: boolean;
  detectedIngredients: Ingredient[];
  detectionError?: string | null;
  canDetect: boolean;
  onStartDetection: (videoElement?: HTMLVideoElement) => void;
  onStopDetection: () => void;
  onTriggerDetection: (videoElement?: HTMLVideoElement) => void;
  onConfirm: () => void;
}

export function CameraScreen({
  isDetecting,
  isProcessing,
  isInitialized,
  detectedIngredients,
  detectionError,
  canDetect,
  onStartDetection,
  onStopDetection,
  onTriggerDetection,
  onConfirm,
}: CameraScreenProps) {
  const webcamRef = useRef<Webcam>(null);

  // Start detection when initialized
  useEffect(() => {
    if (isInitialized && !isDetecting && webcamRef.current?.video) {
      const videoElement = webcamRef.current
        .video as HTMLVideoElement;
      onStartDetection(videoElement);
    }
  }, [isInitialized, isDetecting, onStartDetection]);

  const handleStartDetection = () => {
    if (webcamRef.current?.video) {
      const videoElement = webcamRef.current
        .video as HTMLVideoElement;
      onStartDetection(videoElement);
    }
  };

  const handleTriggerDetection = () => {
    if (webcamRef.current?.video) {
      const videoElement = webcamRef.current
        .video as HTMLVideoElement;
      onTriggerDetection(videoElement);
    }
  };

  const getStatusInfo = () => {
    if (!isInitialized) {
      return {
        status: 'Initializing Google Vision API...',
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        color: 'bg-blue-100 text-blue-800',
      };
    }

    if (isProcessing) {
      return {
        status: 'Analyzing image with AI...',
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        color: 'bg-yellow-100 text-yellow-800',
      };
    }

    if (isDetecting) {
      return {
        status: 'Vision API scanning active',
        icon: <Scan className="h-4 w-4" />,
        color: 'bg-green-100 text-green-800',
      };
    }

    return {
      status: 'Ready to scan',
      icon: <Camera className="h-4 w-4" />,
      color: 'bg-gray-100 text-gray-800',
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Camera className="h-5 w-5 text-green-600" />
          Ingredient Scanner
        </CardTitle>
        <CardDescription>
          Point your camera at ingredients and let Google Vision AI
          identify them
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Camera Feed */}
        <div className="relative rounded-lg overflow-hidden bg-black">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="w-full h-64 object-cover"
            videoConstraints={{
              width: 640,
              height: 480,
              facingMode: 'environment', // Use back camera on mobile
            }}
          />

          {/* Status Overlay */}
          <div className="absolute top-3 left-3 right-3">
            <Badge
              className={`${statusInfo.color} flex items-center gap-2 w-fit`}
            >
              {statusInfo.icon}
              {statusInfo.status}
            </Badge>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-4 flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <span className="text-sm font-medium">
                  Analyzing with Google Vision...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Detection Error */}
        {detectionError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Detection Error
                </p>
                <p className="text-sm text-red-600">
                  {detectionError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Help Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            💡 Tips for better detection:
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Ensure good lighting</li>
            <li>• Hold camera steady for clear images</li>
            <li>• Point at individual ingredients</li>
            <li>• Wait for processing to complete</li>
          </ul>
        </div>

        {/* Detected Ingredients */}
        {detectedIngredients.length > 0 && (
          <div className="space-y-2">
            <Separator />
            <h3 className="text-sm font-medium text-gray-700">
              Detected Ingredients ({detectedIngredients.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {detectedIngredients.map((ingredient) => (
                <Badge
                  key={ingredient.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  {ingredient.name}
                  {ingredient.confidence && (
                    <span className="text-xs text-gray-500">
                      {Math.round(ingredient.confidence * 100)}%
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-2 pt-2">
          {!isDetecting ? (
            <Button
              onClick={handleStartDetection}
              disabled={!isInitialized || isProcessing}
              className="flex-1"
            >
              <Scan className="h-4 w-4 mr-2" />
              Start Scanning
            </Button>
          ) : (
            <Button
              onClick={onStopDetection}
              variant="outline"
              className="flex-1"
            >
              <Camera className="h-4 w-4 mr-2" />
              Stop Scanning
            </Button>
          )}

          {/* Manual Detection Button */}
          {isDetecting && (
            <Button
              onClick={handleTriggerDetection}
              disabled={!canDetect || isProcessing}
              className="flex-1"
              variant={canDetect ? 'default' : 'secondary'}
            >
              <Scan className="h-4 w-4 mr-2" />
              {isProcessing
                ? 'Analyzing...'
                : canDetect
                  ? 'Detect Now'
                  : 'Wait 5s...'}
            </Button>
          )}

          {detectedIngredients.length > 0 && (
            <Button onClick={onConfirm} className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Continue with {detectedIngredients.length} ingredients
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
