export type MealType = string;

export interface Meal {
  id: string;
  type: MealType;
  name: string;
  dayOfWeek: number; // 0-6 for Sunday-Saturday
}