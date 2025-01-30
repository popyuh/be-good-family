export interface UserProfile {
  id: string;
  email: string;
  name: string;
  color: string;
  emoji: string;
  created_at?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  phone?: string;
  avatar_url?: string;
  updated_at?: string;
}

export type ColorOption = {
  name: string;
  value: string;
};

export type EmojiOption = {
  emoji: string;
  id: string;  // Added id for unique keys
};