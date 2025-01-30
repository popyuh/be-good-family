import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { QRCodeSVG } from "qrcode.react";

export const FamilySetup = () => {
  const [familyName, setFamilyName] = useState("");
  const [inviteCode, setInviteCode] = useState("TEST123"); // Default test code
  const [isFirstUser, setIsFirstUser] = useState(true);
  const [qrValue, setQrValue] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkExistingFamily();
  }, []);

  const checkExistingFamily = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: memberData } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (memberData) {
        navigate('/');
        return;
      }

      const { data: families } = await supabase
        .from('family_groups')
        .select('count');

      setIsFirstUser(families?.length === 0);
    } catch (error) {
      console.error('Error checking family:', error);
    }
  };

  const createFamily = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Always use TEST123 for testing
      const testInviteCode = "TEST123";
      
      const { data: family, error } = await supabase
        .from('family_groups')
        .insert([
          {
            name: familyName || 'Test Family', // Default name if empty
            owner_id: user.id,
            invite_code: testInviteCode
          }
        ])
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('family_members')
        .insert([
          {
            family_id: family.id,
            user_id: user.id,
            role: 'owner'
          }
        ]);

      setInviteCode(testInviteCode);
      setQrValue(`${window.location.origin}/join/${testInviteCode}`);
      
      toast({
        title: "Success!",
        description: "Family group created successfully!",
      });
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // For testing, always succeed with any code
      const { data: family } = await supabase
        .from('family_groups')
        .select('*')
        .limit(1)
        .single();

      if (!family) {
        // Create a test family if none exists
        const { data: newFamily, error: createError } = await supabase
          .from('family_groups')
          .insert([
            {
              name: 'Test Family',
              owner_id: user.id,
              invite_code: 'TEST123'
            }
          ])
          .select()
          .single();

        if (createError) throw createError;
        
        await supabase
          .from('family_members')
          .insert([
            {
              family_id: newFamily.id,
              user_id: user.id,
              role: 'member'
            }
          ]);
      } else {
        await supabase
          .from('family_members')
          .insert([
            {
              family_id: family.id,
              user_id: user.id,
              role: 'member'
            }
          ]);
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
              placeholder="Enter your family name (optional for testing)"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
            />
          </div>

          <Button onClick={createFamily} className="w-full">
            Create Test Family Group
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Testing mode: Click join to automatically join a family group
          </p>
          <Button onClick={joinFamily} className="w-full">
            Join Test Family
          </Button>
        </div>
      )}
    </Card>
  );
};