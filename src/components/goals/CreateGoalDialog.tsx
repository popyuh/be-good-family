import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Goal, GoalType } from "@/types/goals";

interface CreateGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateGoal: (goal: Goal) => void;
}

export const CreateGoalDialog = ({
  open,
  onOpenChange,
  onCreateGoal,
}: CreateGoalDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<GoalType>("money");
  const [target, setTarget] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      name,
      description,
      type,
      target: Number(target),
      contributions: [],
    };

    onCreateGoal(newGoal);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setType("money");
    setTarget("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter goal name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter goal description"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select value={type} onValueChange={(value: GoalType) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="money">Money</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="steps">Steps</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Target</label>
            <Input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder={`Enter target ${
                type === "money"
                  ? "amount"
                  : type === "hours"
                  ? "hours"
                  : "steps"
              }`}
              required
              min="0"
              step={type === "money" ? "0.01" : "1"}
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
            <Button type="submit">Create Goal</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};