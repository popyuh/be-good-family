import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { CreateFamilyForm } from "./CreateFamilyForm";
import { JoinFamilyForm } from "./JoinFamilyForm";

export const FamilySetup = () => {
  const [isFirstUser, setIsFirstUser] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkExistingFamily();
  }, []);

  const checkExistingFamily = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: memberData, error: memberError } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (memberError) {
        console.error('Error checking family membership:', memberError);
        toast({
          title: "Error",
          description: "Failed to check family membership. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (memberData) {
        navigate('/');
        return;
      }

      const { count, error: countError } = await supabase
        .from('family_groups')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error checking families count:', countError);
        return;
      }

      setIsFirstUser(count === 0);
    } catch (error) {
      console.error('Error checking family:', error);
      toast({
        title: "Error",
        description: "Failed to check family status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSuccess = () => {
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