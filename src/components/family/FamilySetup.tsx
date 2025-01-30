import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const FamilySetup = () => {
  const [familyName, setFamilyName] = useState("");
  const [isFirstUser, setIsFirstUser] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkExistingFamily();
  }, []);

  const checkExistingFamily = async () => {
    try {
      console.log("Checking existing family...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No user found");
        return;
      }

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
        console.log("User already in family, redirecting...");
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
      console.log("Is first user:", count === 0);
    } catch (error) {
      console.error('Error checking family:', error);
      toast({
        title: "Error",
        description: "Failed to check family status. Please try again.",
        variant: "destructive",
      });
    }
  };

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

      // Generate a random 6-character invite code
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
        .single();

      if (familyError) {
        console.error('Error creating family:', familyError);
        throw familyError;
      }

      console.log("Family created:", family);

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
        console.error('Error adding member:', memberError);
        throw memberError;
      }

      toast({
        title: "Success!",
        description: "Family group created successfully!",
      });

      navigate('/');
    } catch (error) {
      console.error('Error creating family:', error);
      toast({
        title: "Error",
        description: "Failed to create family group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const joinFamily = async () => {
    setIsLoading(true);
    try {
      console.log("Joining family...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // For testing, get the first available family
      const { data: family, error: familyError } = await supabase
        .from('family_groups')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (familyError || !family) {
        console.error('Error finding family:', familyError);
        throw familyError || new Error('No family found to join');
      }

      console.log("Found family to join:", family);

      const { error: memberError } = await supabase
        .from('family_members')
        .insert([
          {
            family_id: family.id,
            user_id: user.id,
            role: 'member'
          }
        ]);

      if (memberError) {
        console.error('Error joining family:', memberError);
        throw memberError;
      }

      toast({
        title: "Success!",
        description: "Joined family group successfully!",
      });
      
      navigate('/');
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
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {isFirstUser ? "Create Your Family Group" : "Join Family Group"}
      </h2>
      
      {isFirstUser ? (
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
      ) : (
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
      )}
    </Card>
  );
};