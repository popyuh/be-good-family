import { useState, KeyboardEvent } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, TrendingDown, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export const BudgetOverview = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [budget, setBudget] = useState(5000);
  const [spent, setSpent] = useState(3240);
  
  const remaining = budget - spent;
  const spentPercentage = Math.min((spent / budget) * 100, 100);
  const remainingPercentage = Math.max((remaining / budget) * 100, 0);

  const handleSave = () => {
    if (spent > budget) {
      toast({
        title: "Error",
        description: "Spent amount cannot exceed budget",
        variant: "destructive",
      });
      return;
    }
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Budget updated successfully",
    });
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 gradient-bg rounded-lg">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              {isEditing ? (
                <Input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  onKeyPress={handleKeyPress}
                  className="w-32"
                  autoFocus
                />
              ) : (
                <h3 className="text-2xl font-bold">${budget.toLocaleString()}</h3>
              )}
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 gradient-bg rounded-lg">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Spent</p>
              {isEditing ? (
                <Input
                  type="number"
                  value={spent}
                  onChange={(e) => setSpent(Number(e.target.value))}
                  onKeyPress={handleKeyPress}
                  className="w-32"
                />
              ) : (
                <h3 className="text-2xl font-bold">${spent.toLocaleString()}</h3>
              )}
            </div>
          </div>
        </div>
        <Progress value={spentPercentage} className="mt-4" />
      </Card>

      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-4">
          <div className="p-2 gradient-bg rounded-lg">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Remaining</p>
            <h3 className="text-2xl font-bold">${remaining.toLocaleString()}</h3>
          </div>
        </div>
        <Progress value={remainingPercentage} className="mt-4" />
      </Card>
    </div>
  );
};