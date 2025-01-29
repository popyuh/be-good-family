import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Goal, GoalType, Contribution } from "@/types/goals";
import { DollarSign, Clock, Target, Trash2, Plus } from "lucide-react";
import { AddContributionDialog } from "./AddContributionDialog";
import { format } from "date-fns";

interface GoalCardProps {
  goal: Goal;
  onUpdate: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
}

export const GoalCard = ({ goal, onUpdate, onDelete }: GoalCardProps) => {
  const [showLedger, setShowLedger] = useState(false);
  const [isAddingContribution, setIsAddingContribution] = useState(false);

  const getIcon = () => {
    switch (goal.type) {
      case "money":
        return <DollarSign className="h-5 w-5" />;
      case "hours":
        return <Clock className="h-5 w-5" />;
      case "steps":
        return <Target className="h-5 w-5" />;
    }
  };

  const getProgress = () => {
    const total = goal.contributions.reduce((sum, contrib) => sum + contrib.amount, 0);
    return Math.min((total / goal.target) * 100, 100);
  };

  const formatValue = (value: number) => {
    switch (goal.type) {
      case "money":
        return `$${value.toLocaleString()}`;
      case "hours":
        return `${value} hrs`;
      case "steps":
        return `${value} steps`;
    }
  };

  const handleAddContribution = (contribution: Contribution) => {
    onUpdate({
      ...goal,
      contributions: [...goal.contributions, contribution],
    });
    setIsAddingContribution(false);
  };

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 gradient-bg rounded-lg">{getIcon()}</div>
            <div>
              <h3 className="font-semibold">{goal.name}</h3>
              <p className="text-sm text-muted-foreground">{goal.description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(goal.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>
              {formatValue(
                goal.contributions.reduce((sum, c) => sum + c.amount, 0)
              )}{" "}
              / {formatValue(goal.target)}
            </span>
          </div>
          <Progress value={getProgress()} />
        </div>

        {showLedger && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Contributions</h4>
            <div className="space-y-1">
              {goal.contributions.map((contribution, index) => (
                <div
                  key={index}
                  className="text-sm flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                      style={{ backgroundColor: contribution.userColor }}
                    >
                      {contribution.userEmoji}
                    </span>
                    <span>{formatValue(contribution.amount)}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {format(new Date(contribution.date), "MMM d, yyyy")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowLedger(!showLedger)}
        >
          {showLedger ? "Hide" : "Show"} Ledger
        </Button>
        <Button size="sm" onClick={() => setIsAddingContribution(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Progress
        </Button>
      </CardFooter>

      <AddContributionDialog
        open={isAddingContribution}
        onOpenChange={setIsAddingContribution}
        onAddContribution={handleAddContribution}
        goalType={goal.type}
      />
    </Card>
  );
};