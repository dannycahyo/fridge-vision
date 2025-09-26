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
import { CheckCircle, ChefHat } from 'lucide-react';
import type { Recipe } from '~/types';

interface RecipeScreenProps {
  recipe: Recipe;
  onStartOver: () => void;
}

export function RecipeScreen({
  recipe,
  onStartOver,
}: RecipeScreenProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-green-600">
          {recipe.dishName}
        </CardTitle>
        <CardDescription>Made with your ingredients</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ingredients Used */}
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Ingredients Used:
          </h3>
          <div className="flex flex-wrap gap-1">
            {recipe.ingredients.map((ingredient, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs"
              >
                {ingredient}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Cooking Instructions */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <ChefHat className="h-4 w-4 text-green-600" />
            Cooking Instructions:
          </h3>
          <ol className="space-y-3">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {instruction}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={onStartOver}
            variant="outline"
            className="flex-1"
          >
            Scan New Ingredients
          </Button>
          <Button onClick={() => window.print()} className="flex-1">
            Save Recipe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
