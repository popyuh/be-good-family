import { useState } from "react";
import { TaskCategory } from "@/components/tasks/TaskCategory";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  assignedUsers: User[];
  completedAt?: Date;
};

export type Category = {
  id: string;
  name: string;
  tasks: Task[];
};

export type User = {
  id: string;
  emoji: string;
  color: string;
  name: string;
};

// Mock users - in a real app, this would come from authentication
const mockUsers: User[] = [
  { id: "1", emoji: "😊", color: "#FFB6C1", name: "Alice" },
  { id: "2", emoji: "🌟", color: "#98FB98", name: "Bob" },
  { id: "3", emoji: "🚀", color: "#87CEEB", name: "Charlie" },
];

export const TasksManager = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Inside", tasks: [] },
    { id: "2", name: "Outside", tasks: [] },
    { id: "3", name: "Misc", tasks: [] },
  ]);
  const [newCategoryName, setNewCategoryName] = useState("");

  const addCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
      tasks: [],
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    toast({
      title: "Success",
      description: "Category added successfully",
    });
  };

  const updateCategory = (categoryId: string, updatedCategory: Category) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId ? updatedCategory : cat
      )
    );
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter((cat) => cat.id !== categoryId));
    toast({
      title: "Success",
      description: "Category deleted successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="flex-1"
        />
        <Button onClick={addCategory} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <TaskCategory
            key={category.id}
            category={category}
            users={mockUsers}
            onUpdate={updateCategory}
            onDelete={deleteCategory}
          />
        ))}
      </div>
    </div>
  );
};