import { Layout } from "@/components/layout/Layout";
import { WeeklyMealPlanner } from "@/components/meals/WeeklyMealPlanner";
import { RecipeDirectory } from "@/components/recipes/RecipeDirectory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MealPlanning = () => {
  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Meal Planning</h1>
        <Tabs defaultValue="planner" className="w-full">
          <TabsList>
            <TabsTrigger value="planner">Weekly Planner</TabsTrigger>
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
          </TabsList>
          <TabsContent value="planner">
            <WeeklyMealPlanner />
          </TabsContent>
          <TabsContent value="recipes">
            <RecipeDirectory />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MealPlanning;