import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useFamily() {
  return useQuery({
    queryKey: ["family"],
    queryFn: async () => {
      console.log("Fetching family status...");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No active session found, skipping family fetch");
        return { isFamilyMember: false };
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Error getting user:", userError);
        throw userError;
      }
      if (!user) {
        console.log("No user found");
        return { isFamilyMember: false };
      }

      const { data: familyMembers, error: familyError } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user.id);

      if (familyError) {
        console.error("Error checking family membership:", familyError);
        return { isFamilyMember: false };
      }

      console.log(`Found ${familyMembers?.length || 0} family memberships`);
      return { 
        isFamilyMember: familyMembers && familyMembers.length > 0,
        memberships: familyMembers 
      };
    },
    retry: false, // Don't retry if there's no session
  });
}