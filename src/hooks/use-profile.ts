import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/types/user";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      console.log("Fetching profile data...");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No active session found, skipping profile fetch");
        return null;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Error fetching user:", userError);
        throw userError;
      }
      if (!user) {
        console.log("No user found");
        return null;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }
      
      console.log("Profile data fetched:", profile);
      return profile as UserProfile;
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true,
    retry: false, // Don't retry if there's no session
  });
}