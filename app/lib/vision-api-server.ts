// Server-side Google Vision API integration for secure ingredient detection

export interface VisionIngredient {
  name: string;
  confidence: number;
  category: 'food' | 'object';
}

export async function detectIngredientsFromImage(
  imageBase64: string,
): Promise<VisionIngredient[]> {
  try {
    const apiKey = process.env.VITE_GOOGLE_VISION_API_KEY;
    if (!apiKey) {
      throw new Error('Google Vision API key not configured');
    }

    const endpoint =
      'https://vision.googleapis.com/v1/images:annotate';

    const requestBody = {
      requests: [
        {
          image: {
            content: imageBase64, // Already base64 encoded without data URL prefix
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 20,
            },
            {
              type: 'OBJECT_LOCALIZATION',
              maxResults: 10,
            },
          ],
        },
      ],
    };

    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Vision API error response:', errorData);
      throw new Error(
        `Vision API error: ${response.status} - ${response.statusText}`,
      );
    }

    const result = await response.json();
    return parseVisionResponse(result);
  } catch (error) {
    console.error('Vision API detection failed:', error);
    throw new Error(
      'Failed to detect ingredients. Please try again.',
    );
  }
}

function parseVisionResponse(response: any): VisionIngredient[] {
  const ingredients: VisionIngredient[] = [];

  // Food-related keywords for filtering
  const foodKeywords = [
    'food',
    'fruit',
    'vegetable',
    'meat',
    'dairy',
    'grain',
    'spice',
    'ingredient',
    'produce',
    'organic',
    'fresh',
    'cooking',
    'kitchen',
    'apple',
    'banana',
    'tomato',
    'onion',
    'carrot',
    'potato',
    'egg',
    'milk',
    'cheese',
    'bread',
    'rice',
    'pasta',
    'chicken',
    'beef',
    'lettuce',
    'pepper',
    'cucumber',
    'broccoli',
    'spinach',
    'mushroom',
    'garlic',
    'ginger',
    'lemon',
    'lime',
    'avocado',
    'orange',
    'strawberry',
    'fish',
    'salmon',
    'tuna',
    'shrimp',
    'beans',
    'nuts',
    'seeds',
  ];

  // Process label detections
  if (response.responses?.[0]?.labelAnnotations) {
    response.responses[0].labelAnnotations.forEach((label: any) => {
      const name = label.description.toLowerCase();
      const confidence = label.score;

      // Filter for food-related items with high confidence
      if (isFoodRelated(name, foodKeywords) && confidence > 0.7) {
        ingredients.push({
          name: cleanIngredientName(name),
          confidence,
          category: 'food',
        });
      }
    });
  }

  // Process object localizations
  if (response.responses?.[0]?.localizedObjectAnnotations) {
    response.responses[0].localizedObjectAnnotations.forEach(
      (obj: any) => {
        const name = obj.name.toLowerCase();
        const confidence = obj.score;

        // Filter for food-related objects with good confidence
        if (isFoodRelated(name, foodKeywords) && confidence > 0.6) {
          ingredients.push({
            name: cleanIngredientName(name),
            confidence,
            category: 'object',
          });
        }
      },
    );
  }

  // Remove duplicates and sort by confidence
  const uniqueIngredients = removeDuplicates(ingredients);
  return uniqueIngredients
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 15); // Limit to top 15 results
}

function isFoodRelated(
  name: string,
  foodKeywords: string[],
): boolean {
  // Direct keyword match
  if (foodKeywords.includes(name)) {
    return true;
  }

  // Partial keyword match
  return foodKeywords.some(
    (keyword) => name.includes(keyword) || keyword.includes(name),
  );
}

function cleanIngredientName(name: string): string {
  // Remove common generic words and clean up the name
  return name
    .replace(
      /\b(food|fresh|organic|raw|cooked|ingredient|item)\b/gi,
      '',
    )
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function removeDuplicates(
  ingredients: VisionIngredient[],
): VisionIngredient[] {
  const seen = new Set<string>();
  return ingredients.filter((ingredient) => {
    const key = ingredient.name.toLowerCase().replace(/\s+/g, '');
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Client-side utility function for capturing images from video
export function captureImageFromVideo(
  videoElement: HTMLVideoElement,
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  ctx?.drawImage(videoElement, 0, 0);

  // Return base64 without data URL prefix for server processing
  const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
  return dataUrl.split(',')[1]; // Remove "data:image/jpeg;base64," prefix
}
