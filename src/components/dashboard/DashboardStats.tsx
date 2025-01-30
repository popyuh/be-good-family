import { useState } from "react";
import { StatCard } from "./StatCard";
import { StatItem } from "@/types/dashboard";
import { Menu, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type DashboardStatsProps = {
  availableStats: StatItem[];
  isCustomizing: boolean;
};

export const DashboardStats = ({ availableStats, isCustomizing }: DashboardStatsProps) => {
  const [selectedStats, setSelectedStats] = useState<StatItem[]>(availableStats.slice(0, 4));

  const handleAddStat = (statToAdd: StatItem) => {
    const isAlreadySelected = selectedStats.find(s => s.label === statToAdd.label);
    if (!isAlreadySelected) {
      setSelectedStats([...selectedStats, statToAdd]);
    }
  };

  const handleRemoveStat = (statToRemove: StatItem) => {
    setSelectedStats(selectedStats.filter(stat => stat.label !== statToRemove.label));
  };

  const availableToAdd = availableStats.filter(
    stat => !selectedStats.find(s => s.label === stat.label)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {selectedStats.map((stat) => (
        <StatCard
          key={stat.label}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          path={stat.path}
          isCustomizing={isCustomizing}
          onRemove={() => handleRemoveStat(stat)}
        />
      ))}

      {isCustomizing && availableToAdd.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="h-full min-h-[120px] border-dashed flex flex-col gap-2 hover:bg-accent"
            >
              <Plus className="h-6 w-6" />
              <Menu className="h-6 w-6" />
              <span className="text-sm">Add Category</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {availableToAdd.map((stat) => (
              <DropdownMenuItem
                key={stat.label}
                onClick={() => handleAddStat(stat)}
                className="cursor-pointer"
              >
                <stat.icon className="mr-2 h-4 w-4" />
                {stat.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};