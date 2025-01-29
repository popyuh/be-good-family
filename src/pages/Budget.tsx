import { Layout } from "@/components/layout/Layout";
import { BudgetOverview } from "@/components/budget/BudgetOverview";
import { BudgetCategories } from "@/components/budget/BudgetCategories";
import { BudgetTransactions } from "@/components/budget/BudgetTransactions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Budget = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-4xl font-bold">Family Budget</h1>
        </div>

        <BudgetOverview />

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="categories">
            <BudgetCategories />
          </TabsContent>
          <TabsContent value="transactions">
            <BudgetTransactions />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Budget;