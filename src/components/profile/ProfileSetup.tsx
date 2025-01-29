import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

const colorOptions: ColorOption[] = [
  { name: "Purple", value: "#9b87f5" },
  { name: "Blue", value: "#0EA5E9" },
  { name: "Pink", value: "#D946EF" },
  { name: "Orange", value: "#F97316" },
];

const emojiOptions: EmojiOption[] = [
  { emoji: "👤", description: "User" },
  { emoji: "😊", description: "Smile" },
  { emoji: "🌟", description: "Star" },
  { emoji: "🎨", description: "Artist" },
  { emoji: "📚", description: "Book" },
  { emoji: "💻", description: "Computer" },
];

export const ProfileSetup = () => {
  const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0].value);
  const [selectedEmoji, setSelectedEmoji] = useState<string>(emojiOptions[0].emoji);
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "No user found. Please sign in again.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          color: selectedColor,
          emoji: selectedEmoji,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>
      
      <div className="space-y-6">
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
          <label className="text-sm font-medium">Choose your emoji</label>
          <Select value={selectedEmoji} onValueChange={setSelectedEmoji}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {emojiOptions.map((option) => (
                <SelectItem key={option.emoji} value={option.emoji}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{option.emoji}</span>
                    <span>{option.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4">
          <Button onClick={handleSubmit} className="w-full">
            Save Profile
          </Button>
        </div>
      </div>
    </Card>
  );
};