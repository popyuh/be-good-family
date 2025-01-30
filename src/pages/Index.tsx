import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileSetup } from "@/components/profile/ProfileSetup";
import { FamilySetup } from "@/components/family/FamilySetup";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { availableStats } from "@/config/dashboard";
import { useProfile } from "@/hooks/use-profile";
import { useFamily } from "@/hooks/use-family";
import { AuthForm } from "@/components/auth/AuthForm";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [session, setSession] = useState<any>(null);
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useProfile();
  const { data: familyData, isLoading: familyLoading } = useFamily();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check and set initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Authenticated" : "Not authenticated");
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session ? "Authenticated" : "Not authenticated");
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      console.log("Attempting to log out...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  console.log("Current profile data:", profile);
  console.log("Profile loading:", profileLoading);
  console.log("Family data:", familyData);
  console.log("Family loading:", familyLoading);

  // Show loading state while checking authentication and loading data
  if (profileLoading || familyLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // If not authenticated, show auth form
  if (!session) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto pt-8">
          <AuthForm />
        </div>
      </Layout>
    );
  }

  // If authenticated but no profile, show profile setup
  if (!profile) {
    console.log("No profile found, showing ProfileSetup");
    return (
      <Layout>
        <div className="max-w-5xl mx-auto pt-8">
          <ProfileSetup onComplete={refetchProfile} />
        </div>
      </Layout>
    );
  }

  // If has profile but no family, show family setup
  if (!familyData?.isFamilyMember) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto pt-8">
          <FamilySetup />
        </div>
      </Layout>
    );
  }

  // If everything is set up, show dashboard
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold">Welcome Back, {profile.name}!</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "transition-colors",
                  isCustomizing && "bg-primary"
                )}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsCustomizing(!isCustomizing)}>
                {isCustomizing ? "Done Customizing" : "Customize Dashboard"}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-500 focus:text-red-500 focus:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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