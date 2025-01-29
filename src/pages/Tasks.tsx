import { Layout } from "@/components/layout/Layout";
import { TasksManager } from "@/components/tasks/TasksManager";

const Tasks = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">Tasks Management</h1>
        <TasksManager />
      </div>
    </Layout>
  );
};

export default Tasks;