import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckSquare, 
  Calendar, 
  Target, 
  DollarSign,
  ShoppingCart,
  Settings,
  Plus,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
  }
];

const Index = () => {
  const [selectedStats, setSelectedStats] = useState<StatItem[]>(availableStats.slice(0, 4));
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleAddStat = (stat: StatItem) => {
    setSelectedStats([...selectedStats, stat]);
  };

  const handleRemoveStat = (statToRemove: StatItem) => {
    setSelectedStats(selectedStats.filter(stat => stat.label !== statToRemove.label));
  };

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