import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface JoinFamilyFormProps {
  onSuccess: () => void;
}

export const JoinFamilyForm = ({ onSuccess }: JoinFamilyFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const joinFamily = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: family, error: familyError } = await supabase
        .from('family_groups')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (familyError || !family) {
        throw familyError || new Error('No family found to join');
      }

      const { error: memberError } = await supabase
        .from('family_members')
        .insert([
          {
            family_id: family.id,
            user_id: user.id,
            role: 'member'
          }
        ]);

      if (memberError) throw memberError;

      toast({
        title: "Success!",
        description: "Joined family group successfully!",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error joining family:', error);
      toast({
        title: "Error",
        description: "Failed to join family group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Click join to automatically join a test family group
      </p>
      <Button 
        onClick={joinFamily} 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Joining..." : "Join Test Family"}
      </Button>
    </div>
  );
};