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
          Review detected ingredients and add any that were missed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Detected Ingredients List */}
        {detectedIngredients.length > 0 && (
          <div>
            <Label className="text-sm font-medium">
              Detected Ingredients:
            </Label>
            <div className="mt-2 space-y-2">
              {detectedIngredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="capitalize">
                      {ingredient.name}
                    </span>
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

        {/* Manual Ingredient Addition */}
        <div>
          <Label
            htmlFor="manual-ingredient"
            className="text-sm font-medium"
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

        {/* Action Buttons */}
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
