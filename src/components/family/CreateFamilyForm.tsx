import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface CreateFamilyFormProps {
  onSuccess: () => void;
}

export const CreateFamilyForm = ({ onSuccess }: CreateFamilyFormProps) => {
  const [familyName, setFamilyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createFamily = async () => {
    // Validate input
    if (!familyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a family name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Getting current user...");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("User error:", userError);
        throw new Error('Authentication error');
      }
      
      if (!user) {
        console.error("No user found");
        throw new Error('No user found');
      }

      console.log("Generating invite code...");
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      console.log("Creating family group...");
      const { data: family, error: familyError } = await supabase
        .from('family_groups')
        .insert([
          {
            name: familyName.trim(),
            owner_id: user.id,
            invite_code: inviteCode
          }
        ])
        .select()
        .single();

      if (familyError) {
        console.error("Family creation error:", familyError);
        throw familyError;
      }

      if (!family) {
        console.error("No family data returned");
        throw new Error('Failed to create family');
      }

      console.log("Adding member to family...");
      const { error: memberError } = await supabase
        .from('family_members')
        .insert([
          {
            family_id: family.id,
            user_id: user.id,
            role: 'owner'
          }
        ]);

      if (memberError) {
        console.error("Member creation error:", memberError);
        // Try to clean up the family group if member creation fails
        await supabase
          .from('family_groups')
          .delete()
          .eq('id', family.id);
        throw memberError;
      }

      console.log("Family creation successful!");
      toast({
        title: "Success!",
        description: `Family group "${familyName}" created successfully!`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error in family creation:', error);
      toast({
        title: "Error",
        description: "Failed to create family group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Family Name</label>
        <Input
          placeholder="Enter your family name"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          disabled={isLoading}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              createFamily();
            }
          }}
        />
      </div>

      <Button 
        onClick={createFamily} 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create Family Group"}
      </Button>
    </div>
  );
};