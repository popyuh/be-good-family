import { Layout } from "@/components/layout/Layout";
import { WeeklyMealPlanner } from "@/components/meals/WeeklyMealPlanner";

const MealPlanning = () => {
  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Meal Planning</h1>
        <WeeklyMealPlanner />
      </div>
    </Layout>
  );
};

export default MealPlanning;