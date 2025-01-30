import { Layout } from "@/components/layout/Layout";
import { useProfile } from "@/hooks/use-profile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
  const { data: profile, isLoading } = useProfile();

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

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{ backgroundColor: profile.color }}
              >
                {profile.emoji}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-muted-foreground">{profile.email}</p>
              </div>
            </div>
            <Button variant="outline" size="icon" asChild>
              <Link to="/profile/edit">
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
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
          </div>
        </Card>
      </div>
    </Layout>
  );
}