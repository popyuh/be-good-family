export type RecipeCategory = 
  | "Breakfast"
  | "Lunch"
  | "Dinner"
  | "Desserts"
  | "Snacks"
  | "Beverages"
  | "Appetizers"
  | "Soups"
  | "Salads"
  | "Main Dishes"
  | "Side Dishes";

export interface Recipe {
  id: string;
  name: string;
  category: RecipeCategory;
  ingredients: string[];
  instructions: string[];
  notes: string;
  source?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: number;
}