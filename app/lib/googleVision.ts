import { ImageAnnotatorClient } from '@google-cloud/vision';
import type { Ingredient } from '~/types';

interface DetectionResult {
  ingredients: Ingredient[];
  error?: string;
}

// Define ingredient-related terms that Vision API might detect
const INGREDIENT_KEYWORDS = [
  // Fruits
  'apple',
  'banana',
  'orange',
  'lemon',
  'lime',
  'grape',
  'berry',
  'strawberry',
  'blueberry',
  'raspberry',
  'blackberry',
  'mango',
  'pineapple',
  'avocado',
  'tomato',
  'peach',
  'pear',
  'cherry',
  'kiwi',
  'watermelon',
  'melon',

  // Vegetables
  'carrot',
  'broccoli',
  'cauliflower',
  'cabbage',
  'lettuce',
  'spinach',
  'kale',
  'onion',
  'garlic',
  'potato',
  'sweet potato',
  'bell pepper',
  'pepper',
  'cucumber',
  'zucchini',
  'eggplant',
  'mushroom',
  'corn',
  'peas',
  'beans',
  'celery',
  'asparagus',
  'radish',
  'turnip',

  // Proteins
  'chicken',
  'beef',
  'pork',
  'fish',
  'salmon',
  'tuna',
  'egg',
  'eggs',
  'tofu',
  'turkey',
  'ham',
  'bacon',
  'sausage',
  'shrimp',
  'crab',

  // Dairy
  'milk',
  'cheese',
  'yogurt',
  'butter',
  'cream',
  'mozzarella',
  'cheddar',

  // Grains & Carbs
  'bread',
  'rice',
  'pasta',
  'flour',
  'oats',
  'quinoa',
  'barley',

  // Herbs & Spices
  'basil',
  'oregano',
  'thyme',
  'rosemary',
  'parsley',
  'cilantro',
  'mint',
  'ginger',
  'turmeric',
  'cumin',
  'paprika',
  'cinnamon',
  'dill',
  'sage',
  'chives',
  'tarragon',

  // Pantry items
  'oil',
  'olive oil',
  'vinegar',
  'salt',
  'sugar',
  'honey',
  'soy sauce',
  'coconut',
  'nuts',
  'almonds',
  'walnuts',
  'pecans',
  'cashews',
  'peanuts',
  'pine nuts',

  // Additional common ingredients
  'lentils',
  'chickpeas',
  'kidney beans',
  'black beans',
  'white beans',
  'sesame',
  'tahini',
  'maple syrup',
  'vanilla',
  'chocolate',
  'cocoa',
];

// Additional categories for broader ingredient detection
const FOOD_RELATED_TERMS = [
  // General food categories that Google Vision might detect
  'food',
  'fruit',
  'vegetable',
  'meat',
  'seafood',
  'dairy',
  'grain',
  'spice',
  'herb',
  'produce',
  'ingredient',
  'fresh',
  'organic',
  'natural',

  // Cooking terms
  'cooking',
  'baking',
  'seasoning',
  'flavoring',

  // Package terms that often contain ingredients
  'can',
  'jar',
  'bottle',
  'package',
  'box',
  'bag',
];

// Generic terms that should NOT be added as ingredients
const GENERIC_FOOD_TERMS = [
  'food',
  'ingredient',
  'produce',
  'fruit',
  'vegetable',
  'meat',
  'seafood',
  'dairy',
  'grain',
  'spice',
  'herb',
  'fresh',
  'organic',
  'natural',
  'cooking',
  'baking',
  'seasoning',
  'flavoring',
  'can',
  'jar',
  'bottle',
  'package',
  'box',
  'bag',
];

// Words to exclude (non-food items commonly detected)
const EXCLUDE_TERMS = [
  'container',
  'plate',
  'bowl',
  'cup',
  'utensil',
  'fork',
  'knife',
  'spoon',
  'table',
  'counter',
  'kitchen',
  'refrigerator',
  'stove',
  'microwave',
  'person',
  'hand',
  'finger',
  'face',
  'head',
  'body',
  'clothing',
  'shirt',
  'background',
  'wall',
  'ceiling',
  'floor',
  'window',
  'door',
  'light',
  'shadow',
  'reflection',
  'camera',
  'phone',
  'screen',
  'plastic',
  'metal',
  'wood',
  'glass',
  'paper',
  'label',
  'text',
  'writing',
  'logo',
  'brand',
  'packaging',
  'wrapper',
  'bag',
  'box',
  'carton',
  'shelf',
  'store',
  'market',
  'grocery',
  'aisle',
  'price',
  'barcode',
  'expiration',
  'date',
  'nutrition',
  'calories',
  'serving',
  'net',
  'weight',
  'size',
  'medium',
  'large',
  'small',
  'inches',
  'cm',
  'lbs',
  'oz',
  'grams',
  'ml',
  'liters',
];

function filterIngredientTexts(texts: string[]): string[] {
  const foundIngredients = new Set<string>();

  texts.forEach((text) => {
    const lowerText = text.toLowerCase().trim();

    // Skip very short texts, numbers, or generic food terms
    if (
      lowerText.length < 2 ||
      /^\d+$/.test(lowerText) ||
      GENERIC_FOOD_TERMS.includes(lowerText)
    ) {
      return;
    }

    // Skip excluded terms
    if (EXCLUDE_TERMS.some((term) => lowerText.includes(term))) {
      return;
    }

    // Method 1: Direct keyword matching (most reliable)
    INGREDIENT_KEYWORDS.forEach((keyword) => {
      if (lowerText.includes(keyword)) {
        // If it's a plural/singular match, normalize to singular
        let ingredient = keyword;
        if (keyword === 'eggs' && lowerText.includes('egg')) {
          ingredient = 'egg';
        }
        foundIngredients.add(ingredient);
      }
    });

    // Method 2: Check if the entire text is an ingredient (exact matches)
    if (INGREDIENT_KEYWORDS.includes(lowerText)) {
      foundIngredients.add(lowerText);
    }

    // Method 3: IMPROVED - Only process texts that seem like specific food items
    // Skip if it's just a generic food category term
    if (!GENERIC_FOOD_TERMS.includes(lowerText)) {
      // Check if it contains food context but isn't a generic term
      const hasBlacklistedWords = EXCLUDE_TERMS.some((term) =>
        lowerText.includes(term),
      );
      const seemsLikeSpecificFood =
        isLikelySpecificFoodItem(lowerText);

      if (!hasBlacklistedWords && seemsLikeSpecificFood) {
        // Clean the text
        const cleaned = lowerText
          .replace(/[^a-z\s]/g, '') // Remove non-letter characters except spaces
          .replace(
            /\b(fresh|organic|natural|raw|cooked|frozen|dried|canned|jarred)\b/g,
            '',
          ) // Remove descriptors
          .trim();

        if (
          cleaned.length > 2 &&
          !GENERIC_FOOD_TERMS.includes(cleaned)
        ) {
          foundIngredients.add(cleaned);
        }
      }
    }
  });

  return Array.from(foundIngredients);
}

// Improved heuristic to identify likely specific food items (not generic categories)
function isLikelySpecificFoodItem(text: string): boolean {
  // Skip if it's too short or contains excluded terms
  if (
    text.length < 3 ||
    EXCLUDE_TERMS.some((term) => text.includes(term)) ||
    GENERIC_FOOD_TERMS.includes(text)
  ) {
    return false;
  }

  // Check for common food suffixes or patterns
  const foodPatterns = [
    /berry$/, // strawberry, blueberry, etc.
    /fruit$/, // passion fruit, dragon fruit, etc.
    /bean$/, // kidney bean, black bean, etc.
    /sauce$/, // tomato sauce, soy sauce, etc.
    /oil$/, // olive oil, coconut oil, etc.
    /milk$/, // almond milk, coconut milk, etc.
    /cheese$/, // blue cheese, goat cheese, etc.
    /meat$/, // ground meat, etc.
    /fish$/, // tuna fish, etc.
    /pepper$/, // bell pepper, black pepper, etc.
    /bread$/, // whole bread, white bread, etc.
    /rice$/, // brown rice, white rice, etc.
    /soup$/, // chicken soup, vegetable soup, etc.
  ];

  // Check if it matches specific food patterns
  const matchesPattern = foodPatterns.some((pattern) =>
    pattern.test(text),
  );

  // Additional check: if it's a compound word that might be a specific food
  const isCompoundFood =
    text.includes(' ') &&
    text.split(' ').length === 2 &&
    !text
      .split(' ')
      .some((word) => GENERIC_FOOD_TERMS.includes(word));

  // Check if it's a known specific ingredient that might not be in our keywords
  const seemsSpecific = !GENERIC_FOOD_TERMS.some(
    (generic) =>
      text === generic ||
      text.startsWith(generic + ' ') ||
      text.endsWith(' ' + generic),
  );

  return matchesPattern || (isCompoundFood && seemsSpecific);
}

export async function analyzeImageForIngredients(
  imageBuffer: Buffer,
): Promise<DetectionResult> {
  try {
    // Check if API key is available
    if (!process.env.GOOGLE_VISION_API_KEY) {
      console.error(
        'GOOGLE_VISION_API_KEY environment variable is not set',
      );
      return {
        ingredients: [],
        error: 'Google Vision API key is not configured',
      };
    }

    // Initialize the Vision API client with API key
    const client = new ImageAnnotatorClient({
      apiKey: process.env.GOOGLE_VISION_API_KEY,
    });

    // Perform text detection on the image
    const [textResult] = await client.textDetection({
      image: { content: imageBuffer },
    });

    // Perform object detection (label detection) on the image
    const [labelResult] = await client.labelDetection({
      image: { content: imageBuffer },
    });

    // Extract text annotations
    const textAnnotations = textResult.textAnnotations || [];
    const detectedTexts = textAnnotations
      .map((annotation) => annotation.description || '')
      .filter((text) => text.length > 1); // Filter out single characters

    // Extract label annotations (objects) with their confidence scores
    const labelAnnotations = labelResult.labelAnnotations || [];
    const detectedLabelsWithConfidence = labelAnnotations
      .filter((label) => (label.score || 0) > 0.6) // Lowered threshold to catch more ingredients
      .map((label) => ({
        text: label.description?.toLowerCase() || '',
        confidence: label.score || 0.6,
      }))
      .filter((label) => label.text.length > 0);

    // Combine text and label detections
    const allDetections = [
      ...detectedTexts,
      ...detectedLabelsWithConfidence.map((label) => label.text),
    ];

    console.log('🔍 Google Vision API raw detections:', {
      textDetections: detectedTexts.slice(0, 10), // First 10 text items
      labelDetections: detectedLabelsWithConfidence.map(
        (l) => `${l.text} (${Math.round(l.confidence * 100)}%)`,
      ),
      totalDetections: allDetections.length,
    });

    // Filter for ingredient-related items
    const ingredientTexts = filterIngredientTexts(allDetections);

    console.log('🥕 Filtered ingredients found:', ingredientTexts);

    // Convert to Ingredient objects with deduplication and better confidence
    const ingredientMap = new Map<string, Ingredient>();

    ingredientTexts.forEach((name, index) => {
      const normalizedName = name.toLowerCase().trim();

      // Skip if we already have this ingredient (deduplication)
      if (!ingredientMap.has(normalizedName)) {
        // Check if this ingredient came from a label detection (has confidence)
        const labelMatch = detectedLabelsWithConfidence.find(
          (label) =>
            label.text === normalizedName ||
            normalizedName.includes(label.text),
        );

        const confidence = labelMatch ? labelMatch.confidence : 0.7; // Use actual confidence or default

        ingredientMap.set(normalizedName, {
          id: `vision-${Date.now()}-${index}`,
          name: normalizedName,
          confidence: confidence,
          detected: true,
        });
      }
    });

    const ingredients = Array.from(ingredientMap.values());

    console.log(
      '✅ Final ingredients returned:',
      ingredients.map((i) => i.name),
    );

    return {
      ingredients,
    };
  } catch (error) {
    console.error('Google Vision API error:', error);

    return {
      ingredients: [],
      error:
        error instanceof Error
          ? error.message
          : 'Failed to analyze image',
    };
  }
}
