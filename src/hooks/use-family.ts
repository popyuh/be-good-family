import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useFamily() {
  return useQuery({
    queryKey: ["family"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) return { isFamilyMember: false };

      const { data: familyMember, error: familyError } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (familyError) return { isFamilyMember: false };
      return { isFamilyMember: !!familyMember };
    }
  });
}