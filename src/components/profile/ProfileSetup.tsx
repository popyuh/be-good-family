import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ColorOption, EmojiOption } from "@/types/user";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const colorOptions = [
  { name: "Purple", value: "#9b87f5" },
  { name: "Blue", value: "#0EA5E9" },
  { name: "Pink", value: "#D946EF" },
  { name: "Orange", value: "#F97316" },
];

const emojiOptions: EmojiOption[] = [
  { emoji: "🦊", id: "fox" },
  { emoji: "🦁", id: "lion" },
  { emoji: "🐯", id: "tiger" },
  { emoji: "🐼", id: "panda" },
  { emoji: "🦝", id: "raccoon" },
  { emoji: "🦨", id: "skunk" },
  { emoji: "🦦", id: "otter" },
  { emoji: "🦥", id: "sloth" },
  { emoji: "🦘", id: "kangaroo" },
  { emoji: "🦙", id: "llama" },
  { emoji: "🦔", id: "hedgehog" },
  { emoji: "🐨", id: "koala" },
  { emoji: "🐹", id: "hamster" },
  { emoji: "🐰", id: "rabbit" },
  { emoji: "🦭", id: "seal" },
];

export const ProfileSetup = ({ onComplete }: { onComplete?: () => void }) => {
  const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0].value);
  const [selectedEmoji, setSelectedEmoji] = useState<string>(emojiOptions[0].emoji);
  const [name, setName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Initial auth check:", session ? "Authenticated" : "Not authenticated");
    };
    checkAuth();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log("Starting profile submission...");

    try {
      // First, get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw sessionError;
      }

      if (!session?.user) {
        console.error('No active session found');
        toast({
          title: "Error",
          description: "Please sign in to continue",
          variant: "destructive",
        });
        return;
      }

      console.log("Current user:", session.user.id);

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          email: session.user.email,
          name: name.trim(),
          color: selectedColor,
          emoji: selectedEmoji,
        });

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }

      console.log("Profile updated successfully");
      
      // Invalidate and refetch profile data
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      // Call onComplete callback if provided
      if (onComplete) {
        await onComplete();
      }

      console.log("Navigating to dashboard...");
      navigate("/");
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4 md:p-6 max-w-md mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-6">Complete Your Profile</h2>
      
      <div className="space-y-6">
        <div className="flex justify-center mb-6">
          <Avatar className="h-24 w-24">
            <AvatarFallback>
              <div 
                className="w-full h-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: selectedColor }}
              >
                {selectedEmoji}
              </div>
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Your name</label>
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Choose your color</label>
          <Select value={selectedColor} onValueChange={setSelectedColor}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color.value }}
                    />
                    {color.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Choose your avatar</label>
          <Select value={selectedEmoji} onValueChange={setSelectedEmoji}>
            <SelectTrigger>
              <div className="text-2xl">{selectedEmoji}</div>
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <div className="grid grid-cols-4 gap-2 p-2">
                {emojiOptions.map((option) => (
                  <SelectItem 
                    key={option.id}
                    value={option.emoji}
                    className="flex items-center justify-center cursor-pointer hover:bg-accent rounded-lg p-2"
                  >
                    <span className="text-2xl">{option.emoji}</span>
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4">
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </div>
            ) : (
              'Save Profile'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
