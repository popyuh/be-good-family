import { useState } from "react";
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

const colorOptions: ColorOption[] = [
  { name: "Purple", value: "#9b87f5" },
  { name: "Blue", value: "#0EA5E9" },
  { name: "Pink", value: "#D946EF" },
  { name: "Orange", value: "#F97316" },
];

const emojiOptions: EmojiOption[] = [
  { emoji: "👩‍🎨" }, // Artist
  { emoji: "🧑‍🎨" }, // Artist (gender-neutral)
  { emoji: "👨‍🎨" }, // Artist (male)
  { emoji: "🎭" },   // Theater/Arts
  { emoji: "🦹‍♀️" }, // Superhero
  { emoji: "🧙‍♀️" }, // Wizard
  { emoji: "🧝‍♀️" }, // Elf
  { emoji: "🧚‍♀️" }, // Fairy
  { emoji: "👻" },   // Ghost
  { emoji: "🦊" },   // Fox
  { emoji: "🦁" },   // Lion
  { emoji: "🐯" },   // Tiger
  { emoji: "🦄" },   // Unicorn
  { emoji: "🐉" },   // Dragon
  { emoji: "🌟" },   // Star
  { emoji: "🎨" },   // Art Palette
];

export const ProfileSetup = () => {
  const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0].value);
  const [selectedEmoji, setSelectedEmoji] = useState<string>(emojiOptions[0].emoji);
  const [name, setName] = useState<string>("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

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
          name: name.trim(),
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
                    key={option.emoji} 
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
          <Button onClick={handleSubmit} className="w-full">
            Save Profile
          </Button>
        </div>
      </div>
    </Card>
  );
};