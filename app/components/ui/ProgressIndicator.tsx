import { Progress } from '~/components/ui/progress';
import type { AppStep } from '~/types';

interface ProgressIndicatorProps {
  currentStep: AppStep;
}

export function ProgressIndicator({
  currentStep,
}: ProgressIndicatorProps) {
  if (currentStep === 'welcome') return null;

  const getProgressValue = () => {
    switch (currentStep) {
      case 'camera':
        return 25;
      case 'confirming':
        return 50;
      case 'generating':
        return 75;
      case 'recipe':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="mb-6">
      <Progress value={getProgressValue()} className="h-2" />
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
        <p className="font-medium">Scan</p>
        <p className="font-medium">Confirm</p>
        <p className="font-medium">Generate</p>
        <p className="font-medium">Enjoy</p>
      </div>
    </div>
  );
}
