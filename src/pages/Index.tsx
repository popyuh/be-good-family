import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { 
  CheckSquare, 
  Calendar, 
  Target, 
  DollarSign,
  ShoppingCart,
  Settings,
  Plus,
  X,
  MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileSetup } from "@/components/profile/ProfileSetup";
import { FamilySetup } from "@/components/family/FamilySetup";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/types/user";

type StatItem = {
  icon: any;
  label: string;
  value: string;
  path: string;
};

const availableStats: StatItem[] = [
  { 
    icon: CheckSquare, 
    label: "Tasks", 
    value: "5 pending", 
    path: "/tasks" 
  },
  { 
    icon: Calendar, 
    label: "Events", 
    value: "2 upcoming", 
    path: "/events" 
  },
  { 
    icon: Target, 
    label: "Goals", 
    value: "3 active", 
    path: "/goals" 
  },
  { 
    icon: DollarSign, 
    label: "Budget", 
    value: "$1,200 saved", 
    path: "/budget" 
  },
  {
    icon: ShoppingCart,
    label: "Shopping",
    value: "3 items",
    path: "/shopping"
  },
  {
    icon: MessageCircle,
    label: "Messages",
    value: "2 groups",
    path: "/messages"
  }
];

const Index = () => {
  const [selectedStats, setSelectedStats] = useState<StatItem[]>(availableStats.slice(0, 4));
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isFamilyMember, setIsFamilyMember] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndFamily = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          setUserProfile(profile);

          // Check if user is part of a family
          const { data: familyMember } = await supabase
            .from('family_members')
            .select('*')
            .eq('user_id', user.id)
            .single();

          setIsFamilyMember(!!familyMember);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndFamily();
  }, []);

  const handleAddStat = (stat: StatItem) => {
    setSelectedStats([...selectedStats, stat]);
  };

  const handleRemoveStat = (statToRemove: StatItem) => {
    setSelectedStats(selectedStats.filter(stat => stat.label !== statToRemove.label));
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Show profile setup if user hasn't set up their profile
  if (!userProfile) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto pt-8">
          <ProfileSetup />
        </div>
      </Layout>
    );
  }

  // Show family setup if user has profile but isn't part of a family
  if (!isFamilyMember) {
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {selectedStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.label} 
                className="p-4 md:p-6 card-hover cursor-pointer relative"
                onClick={() => !isCustomizing && (window.location.href = stat.path)}
              >
                {isCustomizing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-white hover:bg-destructive/90 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveStat(stat);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2 gradient-bg rounded-lg shrink-0">
                    <Icon size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base">{stat.label}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}

          {isCustomizing && selectedStats.length < availableStats.length && (
            <Card 
              className="p-4 md:p-6 card-hover cursor-pointer border-dashed"
              onClick={() => {
                const availableToAdd = availableStats.filter(
                  stat => !selectedStats.find(s => s.label === stat.label)
                );
                if (availableToAdd.length > 0) {
                  handleAddStat(availableToAdd[0]);
                }
              }}
            >
              <div className="flex items-center justify-center h-full">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
