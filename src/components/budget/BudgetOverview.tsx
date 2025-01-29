import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

type Category = {
  name: string;
  budget: number;
  spent: number;
};

type BudgetOverviewProps = {
  categories: Category[];
};

export const BudgetOverview = ({ categories }: BudgetOverviewProps) => {
  const budget = categories.reduce((sum, category) => sum + category.budget, 0);
  const spent = categories.reduce((sum, category) => sum + category.spent, 0);
  const remaining = budget - spent;
  
  const spentPercentage = Math.min((spent / budget) * 100, 100);
  const remainingPercentage = Math.max((remaining / budget) * 100, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-4">
          <div className="p-2 gradient-bg rounded-lg">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <h3 className="text-2xl font-bold">${budget.toLocaleString()}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-4">
          <div className="p-2 gradient-bg rounded-lg">
            <TrendingDown className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Spent</p>
            <h3 className="text-2xl font-bold">${spent.toLocaleString()}</h3>
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