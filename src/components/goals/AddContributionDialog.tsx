import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Contribution, GoalType } from "@/types/goals";

interface AddContributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddContribution: (contribution: Contribution) => void;
  goalType: GoalType;
}

export const AddContributionDialog = ({
  open,
  onOpenChange,
  onAddContribution,
  goalType,
}: AddContributionDialogProps) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const contribution: Contribution = {
      amount: Number(amount),
      date: new Date().toISOString(),
      userEmoji: "👤", // This should come from user context
      userColor: "#9b87f5", // This should come from user context
    };

    onAddContribution(contribution);
    setAmount("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Progress</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {goalType === "money"
                ? "Amount"
                : goalType === "hours"
                ? "Hours"
                : "Steps"}
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Enter ${
                goalType === "money"
                  ? "amount"
                  : goalType === "hours"
                  ? "hours"
                  : "steps"
              }`}
              required
              min="0"
              step={goalType === "money" ? "0.01" : "1"}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Progress</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};