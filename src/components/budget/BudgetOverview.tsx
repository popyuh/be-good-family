import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export const BudgetOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-4">
          <div className="p-2 gradient-bg rounded-lg">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <h3 className="text-2xl font-bold">$5,000</h3>
          </div>
        </div>
      </Card>

      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-4">
          <div className="p-2 gradient-bg rounded-lg">
            <TrendingDown className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Spent</p>
            <h3 className="text-2xl font-bold">$3,240</h3>
          </div>
        </div>
        <Progress value={65} className="mt-4" />
      </Card>

      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-4">
          <div className="p-2 gradient-bg rounded-lg">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Remaining</p>
            <h3 className="text-2xl font-bold">$1,760</h3>
          </div>
        </div>
        <Progress value={35} className="mt-4" />
      </Card>
    </div>
  );
};