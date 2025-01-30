import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useProfile } from "@/hooks/use-profile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { Link } from "react-router-dom";
import { Pencil, Save, X, Upload } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Profile() {
  const { data: profile, isLoading, refetch } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    timezone: "",
    phone: "",
    avatar_url: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Initialize form data when profile loads
  useState(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
        location: profile.location || "",
        timezone: profile.timezone || "",
        phone: profile.phone || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground mb-4">
              Please complete your profile setup to continue.
            </p>
            <Button asChild>
              <Link to="/profile/setup">Complete Profile</Link>
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (url: string) => {
    setFormData(prev => ({ ...prev, avatar_url: url }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', profile.id);

      if (error) throw error;

      await refetch();
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 relative">
          <div className="absolute top-4 right-4 flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {isEditing ? (
                <AvatarUpload
                  currentAvatarUrl={formData.avatar_url}
                  onUploadComplete={handleAvatarUpload}
                  userEmoji={profile.emoji}
                  userColor={profile.color}
                />
              ) : (
                profile.avatar_url ? (
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback>
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                    style={{ backgroundColor: profile.color }}
                  >
                    {profile.emoji}
                  </div>
                )
              )}
              <div className="flex-1 sm:flex-initial">
                {isEditing ? (
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="font-bold text-xl mb-1"
                  />
                ) : (
                  <h1 className="text-2xl font-bold mb-2">{profile.name}</h1>
                )}
              </div>
            </div>
          </div>

          {!isEditing && (
            <p className="text-muted-foreground text-sm mb-6">{profile.email}</p>
          )}

          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bio</label>
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Where are you based?"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Timezone</label>
                  <Input
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    placeholder="Your timezone"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                    className="mt-1"
                  />
                </div>
              </>
            ) : (
              <>
                {profile.bio && (
                  <div>
                    <h2 className="text-sm font-medium text-muted-foreground">Bio</h2>
                    <p className="mt-1">{profile.bio}</p>
                  </div>
                )}

                {profile.location && (
                  <div>
                    <h2 className="text-sm font-medium text-muted-foreground">Location</h2>
                    <p className="mt-1">{profile.location}</p>
                  </div>
                )}

                {profile.timezone && (
                  <div>
                    <h2 className="text-sm font-medium text-muted-foreground">Timezone</h2>
                    <p className="mt-1">{profile.timezone}</p>
                  </div>
                )}

                {profile.phone && (
                  <div>
                    <h2 className="text-sm font-medium text-muted-foreground">Phone</h2>
                    <p className="mt-1">{profile.phone}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
