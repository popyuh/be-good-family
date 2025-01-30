import { Layout } from "@/components/layout/Layout";
import { WeeklyMealPlanner } from "@/components/meals/WeeklyMealPlanner";
import { RecipeDirectory } from "@/components/recipes/RecipeDirectory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UtensilsCrossed, Book } from "lucide-react";

const MealPlanning = () => {
  return (
    <Layout>
      <div className="container py-6 animate-enter">
        <h1 className="text-3xl font-bold mb-6 text-muted-blue dark:text-warm-beige">
          Meal Planning
        </h1>
        
        <Tabs defaultValue="planner" className="w-full">
          <TabsList className="w-full sm:w-auto glass-effect mb-6">
            <TabsTrigger value="planner" className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              <span>Weekly Planner</span>
            </TabsTrigger>
            <TabsTrigger value="recipes" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span>Recipes</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="planner" className="animate-enter">
            <WeeklyMealPlanner />
          </TabsContent>
          
          <TabsContent value="recipes" className="animate-enter">
            <RecipeDirectory />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MealPlanning;