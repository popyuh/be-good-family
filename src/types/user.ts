export interface UserProfile {
  id: string;
  email: string;
  color: string;
  emoji: string;
  created_at?: string;
}

export type ColorOption = {
  name: string;
  value: string;
};

export type EmojiOption = {
  emoji: string;
  description: string;
};