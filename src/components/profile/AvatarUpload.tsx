import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  onUploadComplete: (url: string) => void;
}

export const AvatarUpload = ({ currentAvatarUrl, onUploadComplete }: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
      
      toast({
        title: "Success",
        description: "Avatar uploaded successfully",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error uploading avatar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={currentAvatarUrl || undefined} />
        <AvatarFallback>
          <Upload className="h-8 w-8 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="hidden"
          id="avatar-upload"
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById('avatar-upload')?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Change Avatar'}
        </Button>
      </div>
    </div>
  );
};