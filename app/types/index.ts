// App Flow Types
export type AppStep =
  | 'welcome'
  | 'camera'
  | 'confirming'
  | 'generating'
  | 'recipe';
export type CameraStatus =
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied';

// Data Types
export interface Ingredient {
  id: string;
  name: string;
  confidence?: number;
  detected?: boolean;
}

export interface Recipe {
  dishName: string;
  ingredients: string[];
  instructions: string[];
}

// Action Data Types
export interface ActionData {
  recipe?: Recipe;
  error?: string;
}
