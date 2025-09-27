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
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Use your camera to detect items, then curate your
            ingredient list for the perfect AI-generated recipe!
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
            How it works:
          </h3>
          <ol className="space-y-1 list-decimal list-inside">
            <li className="font-medium text-sm text-green-700 dark:text-green-400">
              Camera detects everything visible in your kitchen
            </li>
            <li className="font-medium text-sm text-green-700 dark:text-green-400">
              Remove irrelevant items and add missing ingredients
            </li>
            <li className="font-medium text-sm text-green-700 dark:text-green-400">
              AI generates a custom recipe using your ingredients
            </li>
            <li className="font-medium text-sm text-green-700 dark:text-green-400">
              Cook your personalized dish!
            </li>
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
