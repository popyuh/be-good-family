import { Layout } from "@/components/layout/Layout";
import { GoalsManager } from "@/components/goals/GoalsManager";

const Goals = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">Goals</h1>
        <GoalsManager />
      </div>
    </Layout>
  );
};

export default Goals;