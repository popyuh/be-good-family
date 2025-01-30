import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  onUploadComplete: (url: string) => void;
  userEmoji?: string;
  userColor?: string;
}

export const AvatarUpload = ({ 
  currentAvatarUrl, 
  onUploadComplete, 
  userEmoji,
  userColor 
}: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (currentAvatarUrl) {
      getSignedUrl(currentAvatarUrl);
    }
  }, [currentAvatarUrl]);

  const getSignedUrl = async (path: string) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('ProfilePic')
        .createSignedUrl(path, 3600);

      if (error) {
        console.error('Error getting signed URL:', error);
        return;
      }

      if (data?.signedUrl) {
        setAvatarUrl(data.signedUrl);
      }
    } catch (error) {
      console.error('Error in getSignedUrl:', error);
    }
  };

  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('File type not supported. Please upload a JPG, PNG, or WebP image.');
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }
    
    return true;
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      validateFile(file);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('ProfilePic')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get a signed URL for the uploaded file
      const { data: urlData, error: urlError } = await supabase.storage
        .from('ProfilePic')
        .createSignedUrl(fileName, 3600);

      if (urlError) {
        throw urlError;
      }

      if (urlData?.signedUrl) {
        setAvatarUrl(urlData.signedUrl);
        onUploadComplete(fileName);
      }
      
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
      console.error('Error in uploadAvatar:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback style={{ backgroundColor: userColor }}>
          {!avatarUrl && userEmoji ? (
            <span className="text-2xl">{userEmoji}</span>
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/jpeg,image/png,image/webp"
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