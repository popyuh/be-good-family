import { useState } from "react";
import { StatCard } from "./StatCard";
import { AddStatCard } from "./AddStatCard";
import { StatItem } from "@/types/dashboard";

type DashboardStatsProps = {
  availableStats: StatItem[];
  isCustomizing: boolean;
};

export const DashboardStats = ({ availableStats, isCustomizing }: DashboardStatsProps) => {
  const [selectedStats, setSelectedStats] = useState<StatItem[]>(availableStats.slice(0, 4));

  const handleAddStat = () => {
    const availableToAdd = availableStats.filter(
      stat => !selectedStats.find(s => s.label === stat.label)
    );
    if (availableToAdd.length > 0) {
      setSelectedStats([...selectedStats, availableToAdd[0]]);
    }
  };

  const handleRemoveStat = (statToRemove: StatItem) => {
    setSelectedStats(selectedStats.filter(stat => stat.label !== statToRemove.label));
  };

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

      {isCustomizing && selectedStats.length < availableStats.length && (
        <AddStatCard onClick={handleAddStat} />
      )}
    </div>
  );
};