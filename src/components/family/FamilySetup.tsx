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
        return;
      }

      if (memberData) {
        console.log("User already in family, redirecting...");
        navigate('/');
        return;
      }

      const { count } = await supabase
        .from('family_groups')
        .select('*', { count: 'exact', head: true });

      setIsFirstUser(count === 0);
      console.log("Is first user:", count === 0);
    } catch (error) {
      console.error('Error checking family:', error);
    }
  };

  const createFamily = async () => {
    try {
      console.log("Creating family...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: family, error: familyError } = await supabase
        .from('family_groups')
        .insert([
          {
            name: familyName || 'Test Family',
            owner_id: user.id,
            invite_code: 'TEST123'
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
        description: "Failed to create family group",
        variant: "destructive",
      });
    }
  };

  const joinFamily = async () => {
    try {
      console.log("Joining family...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // For testing, get the first available family
      const { data: family, error: familyError } = await supabase
        .from('family_groups')
        .select('*')
        .limit(1)
        .single();

      if (familyError) {
        console.error('Error finding family:', familyError);
        throw familyError;
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
        description: "Failed to join family group",
        variant: "destructive",
      });
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
            />
          </div>

          <Button onClick={createFamily} className="w-full">
            Create Family Group
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Click join to automatically join a test family group
          </p>
          <Button onClick={joinFamily} className="w-full">
            Join Test Family
          </Button>
        </div>
      )}
    </Card>
  );
};