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
          Use your camera to detect items, then curate your ingredient
          list for the perfect AI-generated recipe!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
            How it works:
          </h3>
          <ol className="text-sm text-green-700 dark:text-green-400 space-y-1">
            <li>
              1. Camera detects everything visible in your kitchen
            </li>
            <li>
              2. Remove irrelevant items and add missing ingredients
            </li>
            <li>
              3. AI generates a custom recipe using your ingredients
            </li>
            <li>4. Cook your personalized dish!</li>
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
