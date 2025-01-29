import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GoalCard } from "./GoalCard";
import { CreateGoalDialog } from "./CreateGoalDialog";
import { Goal, GoalType } from "@/types/goals";

export const GoalsManager = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateGoal = (newGoal: Goal) => {
    setGoals((prev) => [...prev, newGoal]);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateGoal = (updatedGoal: Goal) => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal))
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          No goals yet. Click the button above to create your first goal!
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdate={handleUpdateGoal}
              onDelete={handleDeleteGoal}
            />
          ))}
        </div>
      )}

      <CreateGoalDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateGoal={handleCreateGoal}
      />
    </div>
  );
};