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
  const [inviteCode, setInviteCode] = useState("");
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

      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { data: family, error } = await supabase
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

      setInviteCode(inviteCode);
      setQrValue(`${window.location.origin}/join/${inviteCode}`);
      
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

      const { data: family } = await supabase
        .from('family_groups')
        .select('*')
        .eq('invite_code', inviteCode)
        .single();

      if (!family) {
        toast({
          title: "Error",
          description: "Invalid invite code",
          variant: "destructive",
        });
        return;
      }

      await supabase
        .from('family_members')
        .insert([
          {
            family_id: family.id,
            user_id: user.id,
            role: 'member'
          }
        ]);

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

          {!qrValue ? (
            <Button onClick={createFamily} className="w-full">
              Create Family Group
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <QRCodeSVG value={qrValue} size={200} />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Share this code with family members:</p>
                  <code className="bg-muted p-2 rounded text-lg">{inviteCode}</code>
                </div>
              </div>
              <Button onClick={() => navigate('/')} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Invite Code</label>
            <Input
              placeholder="Enter invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            />
          </div>

          <Button onClick={joinFamily} className="w-full">
            Join Family
          </Button>
        </div>
      )}
    </Card>
  );
};