import { Form } from 'react-router';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { ChefHat, Loader2 } from 'lucide-react';
import type { Ingredient } from '~/types';

interface GenerationScreenProps {
  detectedIngredients: Ingredient[];
  isSubmitting: boolean;
}

export function GenerationScreen({
  detectedIngredients,
  isSubmitting,
}: GenerationScreenProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <Form method="post">
          <input
            type="hidden"
            name="ingredients"
            value={detectedIngredients
              .map((ing) => ing.name)
              .join(',')}
          />
          <Button
            type="submit"
            className="w-full h-12"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Your Recipe...
              </>
            ) : (
              <>
                <ChefHat className="mr-2 h-4 w-4" />
                Generate Recipe
              </>
            )}
          </Button>
        </Form>

        {isSubmitting && (
          <div className="mt-6 space-y-3">
            <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
              Our AI chef is creating something delicious...
            </p>
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
              <Skeleton className="h-4 w-2/3 mx-auto" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
