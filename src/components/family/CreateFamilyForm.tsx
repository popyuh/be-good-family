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
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const createFamily = async () => {
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
      console.log("Creating family...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { data: family, error: familyError } = await supabase
        .from('family_groups')
        .insert([
          {
            name: familyName,
            owner_id: user.id,
            invite_code: inviteCode
          }
        ])
        .select()
        .maybeSingle();

      if (familyError) throw familyError;

      console.log("Family created, adding member...");
      const { error: memberError } = await supabase
        .from('family_members')
        .insert([
          {
            family_id: family.id,
            user_id: user.id,
            role: 'owner'
          }
        ]);

      if (memberError) throw memberError;

      console.log("Successfully created family and added member");
      toast({
        title: "Success!",
        description: "Family group created successfully!",
      });

      onSuccess();
    } catch (error) {
      console.error('Error creating family:', error);
      if (retryCount < 3) {
        console.log(`Retrying creation (attempt ${retryCount + 1})...`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => createFamily(), 1000);
      } else {
        toast({
          title: "Error",
          description: "Failed to create family group. Please try again.",
          variant: "destructive",
        });
      }
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