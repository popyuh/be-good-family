import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/types/user";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) return null;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      return profile as UserProfile;
    }
  });
}