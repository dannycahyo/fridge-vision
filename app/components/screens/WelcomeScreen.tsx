import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Camera, Loader2 } from 'lucide-react';
import type { CameraStatus } from '~/types';

interface WelcomeScreenProps {
  cameraStatus: CameraStatus;
  onStartScanning: () => void;
}

export function WelcomeScreen({
  cameraStatus,
  onStartScanning,
}: WelcomeScreenProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Camera className="h-6 w-6" />
          Ready to Cook?
        </CardTitle>
        <CardDescription>
          Point your camera at your fridge and let AI create amazing
          recipes from what you have!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
            How it works:
          </h3>
          <ol className="text-sm text-green-700 dark:text-green-400 space-y-1">
            <li>1. Scan your ingredients with your camera</li>
            <li>2. Confirm and add any missed items</li>
            <li>3. Let AI generate a personalized recipe</li>
            <li>4. Start cooking your new dish!</li>
          </ol>
        </div>
        <Button
          onClick={onStartScanning}
          className="w-full h-12"
          disabled={cameraStatus === 'requesting'}
        >
          {cameraStatus === 'requesting' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Requesting Camera Access...
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Start Scanning Ingredients
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
