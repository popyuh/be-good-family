import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { CreateFamilyForm } from "./CreateFamilyForm";
import { JoinFamilyForm } from "./JoinFamilyForm";
import { useProfile } from "@/hooks/use-profile";

export const FamilySetup = () => {
  const [isFirstUser, setIsFirstUser] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();

  const checkExistingFamily = async () => {
    try {
      console.log("Checking existing family...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No user found");
        return;
      }

      if (!profile) {
        console.log("No profile found, redirecting to profile setup");
        navigate('/profile-setup');
        return;
      }

      // First check if user is already a member of a family
      const { data: memberData, error: memberError } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (memberError) {
        console.error('Error checking family membership:', memberError);
        if (retryCount < 3) {
          console.log(`Retrying check (attempt ${retryCount + 1})...`);
          setRetryCount(prev => prev + 1);
          return;
        }
        toast({
          title: "Error",
          description: "Failed to check family membership. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (memberData) {
        console.log("User is already a family member, redirecting...");
        navigate('/');
        return;
      }

      // Then check if there are any existing families
      const { count, error: countError } = await supabase
        .from('family_groups')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error checking families count:', countError);
        return;
      }

      console.log(`Found ${count} existing families`);
      setIsFirstUser(count === 0);
    } catch (error) {
      console.error('Error in checkExistingFamily:', error);
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 1000); // Wait 1 second before retrying
      } else {
        toast({
          title: "Error",
          description: "Failed to check family status. Please refresh the page.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    if (!profileLoading) {
      checkExistingFamily();
    }
  }, [retryCount, profileLoading, profile]);

  if (profileLoading) {
    return (
      <Card className="p-6 max-w-md mx-auto">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  const handleSuccess = () => {
    console.log("Family setup successful, navigating to home...");
    navigate('/');
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {isFirstUser ? "Create Your Family Group" : "Join Family Group"}
      </h2>
      
      {isFirstUser ? (
        <CreateFamilyForm onSuccess={handleSuccess} />
      ) : (
        <JoinFamilyForm onSuccess={handleSuccess} />
      )}
    </Card>
  );
};