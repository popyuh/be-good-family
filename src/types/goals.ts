export type GoalType = "money" | "hours" | "steps";

export interface Contribution {
  amount: number;
  date: string;
  userEmoji: string;
  userColor: string;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  type: GoalType;
  target: number;
  contributions: Contribution[];
}