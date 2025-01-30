export interface FamilyGroup {
  id: string;
  name: string;
  created_at: string;
  invite_code: string;
  owner_id: string;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  user_id: string;
  role: 'owner' | 'member';
  joined_at: string;
}