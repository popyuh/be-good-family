import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileSetup } from "@/components/profile/ProfileSetup";
import { FamilySetup } from "@/components/family/FamilySetup";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { availableStats } from "@/config/dashboard";
import { useProfile } from "@/hooks/use-profile";
import { useFamily } from "@/hooks/use-family";

const Index = () => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: familyData, isLoading: familyLoading } = useFamily();

  if (profileLoading || familyLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto pt-8">
          <ProfileSetup />
        </div>
      </Layout>
    );
  }

  if (!familyData?.isFamilyMember) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto pt-8">
          <FamilySetup />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold">Welcome Back, Family!</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCustomizing(!isCustomizing)}
            className={cn(
              "transition-colors",
              isCustomizing && "bg-primary"
            )}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        
        <DashboardStats 
          availableStats={availableStats}
          isCustomizing={isCustomizing}
        />
      </div>
    </Layout>
  );
};

export default Index;