import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { Plus, X } from 'lucide-react';
import type { Ingredient } from '~/types';

interface ConfirmationScreenProps {
  detectedIngredients: Ingredient[];
  manualIngredient: string;
  onManualIngredientChange: (value: string) => void;
  onRemoveIngredient: (id: string) => void;
  onAddManualIngredient: () => void;
  onBackToCamera: () => void;
  onProceedToGeneration: () => void;
}

export function ConfirmationScreen({
  detectedIngredients,
  manualIngredient,
  onManualIngredientChange,
  onRemoveIngredient,
  onAddManualIngredient,
  onBackToCamera,
  onProceedToGeneration,
}: ConfirmationScreenProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onAddManualIngredient();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirm Your Ingredients</CardTitle>
        <CardDescription>
          Remove non-food items and add any ingredients the camera
          missed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {detectedIngredients.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              🧹 <strong>Clean up time!</strong> Remove items that
              aren't ingredients (like "laptop" or "person") and add
              any food items the camera missed.
            </p>
          </div>
        )}

        {detectedIngredients.length > 0 && (
          <div>
            <Label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Camera Detected Items:
            </Label>
            <div className="mt-2 space-y-2">
              {detectedIngredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <p className="capitalize font-medium text-gray-900 dark:text-gray-100">
                      {ingredient.name}
                    </p>
                    {ingredient.detected && (
                      <Badge variant="secondary" className="text-xs">
                        AI Detected
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveIngredient(ingredient.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        <div>
          <Label
            htmlFor="manual-ingredient"
            className="text-sm font-semibold text-gray-900 dark:text-gray-100"
          >
            Add Ingredients Manually:
          </Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="manual-ingredient"
              value={manualIngredient}
              onChange={(e) =>
                onManualIngredientChange(e.target.value)
              }
              placeholder="e.g., salt, olive oil, garlic"
              onKeyPress={handleKeyPress}
            />
            <Button
              onClick={onAddManualIngredient}
              disabled={!manualIngredient.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onBackToCamera}
            className="flex-1"
          >
            Back to Camera
          </Button>
          <Button
            onClick={onProceedToGeneration}
            disabled={detectedIngredients.length === 0}
            className="flex-1"
          >
            Generate Recipe ({detectedIngredients.length})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
