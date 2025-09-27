import { Alert, AlertDescription } from '~/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
      <AlertDescription className="text-red-800 dark:text-red-200">
        {error}
      </AlertDescription>
    </Alert>
  );
}
