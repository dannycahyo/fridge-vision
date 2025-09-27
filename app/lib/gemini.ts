import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.VITE_GEMINI_API_KEY!,
});

export async function generateRecipe(ingredients: string[]): Promise<{
  dishName: string;
  ingredients: string[];
  instructions: string[];
}> {
  try {
    const prompt = `You are a professional chef and recipe creator. Create a delicious, practical recipe using ONLY the following ingredients (you may suggest common kitchen staples like salt, pepper, oil if needed): ${ingredients.join(', ')}.

    Please format your response EXACTLY as follows (this is critical for parsing):

    DISH_NAME: [Name of the dish]
    INGREDIENTS:
    - [ingredient 1]
    - [ingredient 2]
    - [ingredient 3]
    (etc.)

    INSTRUCTIONS:
    1. [First step]
    2. [Second step]
    3. [Third step]
    (etc.)

    Requirements:
    - Use only the provided ingredients plus basic seasonings (salt, pepper, oil, etc.)
    - Create a recipe that can be made in 30 minutes or less
    - Include 5-8 clear, easy-to-follow steps
    - Make it delicious and practical for home cooking
    - Don't add ingredients that weren't provided unless they're very basic seasonings
- Keep the dish name creative but descriptive
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
    });

    const text = response.text || '';

    // Parse the response
    const parsed = parseGeminiResponse(text, ingredients);
    return parsed;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate recipe. Please try again.');
  }
}

function parseGeminiResponse(
  text: string,
  originalIngredients: string[],
): {
  dishName: string;
  ingredients: string[];
  instructions: string[];
} {
  try {
    // Extract dish name
    const dishNameMatch = text.match(/DISH_NAME:\s*(.+)/i);
    const dishName = dishNameMatch
      ? dishNameMatch[1].trim()
      : 'Delicious Recipe';

    // Extract ingredients section
    const ingredientsMatch = text.match(
      /INGREDIENTS:\s*([\s\S]*?)(?=INSTRUCTIONS:|$)/i,
    );
    let ingredients = originalIngredients;

    if (ingredientsMatch) {
      const ingredientsList = ingredientsMatch[1]
        .split('\n')
        .map((line) => line.trim())
        .filter(
          (line) => line.startsWith('-') || line.match(/^\d+\./),
        )
        .map((line) => line.replace(/^[-\d.]\s*/, '').trim())
        .filter((line) => line.length > 0);

      if (ingredientsList.length > 0) {
        ingredients = ingredientsList;
      }
    }

    // Extract instructions
    const instructionsMatch = text.match(
      /INSTRUCTIONS:\s*([\s\S]*?)$/i,
    );
    let instructions: string[] = [
      'Follow the recipe instructions provided.',
      'Cook according to your taste preferences.',
      'Serve and enjoy!',
    ];

    if (instructionsMatch) {
      const instructionsList = instructionsMatch[1]
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.match(/^\d+\./))
        .map((line) => line.replace(/^\d+\.\s*/, '').trim())
        .filter((line) => line.length > 0);

      if (instructionsList.length > 0) {
        instructions = instructionsList;
      }
    }

    return {
      dishName,
      ingredients,
      instructions,
    };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);

    // Fallback response
    return {
      dishName: 'Creative Recipe',
      ingredients: originalIngredients,
      instructions: [
        'Prepare all ingredients by washing and chopping as needed.',
        'Heat a pan or pot over medium heat with a little oil.',
        'Add ingredients starting with those that take longer to cook.',
        'Season with salt and pepper to taste.',
        'Cook until all ingredients are tender and well combined.',
        'Adjust seasoning and serve hot.',
        'Enjoy your delicious creation!',
      ],
    };
  }
}
