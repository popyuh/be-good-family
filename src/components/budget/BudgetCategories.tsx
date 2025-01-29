import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const categories = [
  { name: "Groceries", budget: 800, spent: 650 },
  { name: "Utilities", budget: 400, spent: 380 },
  { name: "Entertainment", budget: 300, spent: 220 },
  { name: "Transportation", budget: 200, spent: 150 },
];

export const BudgetCategories = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Budget Categories</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="grid gap-4">
        {categories.map((category) => {
          const percentage = (category.spent / category.budget) * 100;
          return (
            <Card key={category.name} className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  ${category.spent} / ${category.budget}
                </p>
              </div>
              <Progress value={percentage} />
            </Card>
          );
        })}
      </div>
    </div>
  );
};