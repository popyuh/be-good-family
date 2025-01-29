import { useState } from "react";
import { Category, Task, User } from "./TasksManager";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit2, Plus, Save, X } from "lucide-react";
import { TaskItem } from "./TaskItem";
import { useToast } from "@/components/ui/use-toast";

interface TaskCategoryProps {
  category: Category;
  users: User[];
  onUpdate: (categoryId: string, updatedCategory: Category) => void;
  onDelete: (categoryId: string) => void;
}

export const TaskCategory = ({
  category,
  users,
  onUpdate,
  onDelete,
}: TaskCategoryProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(category.name);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleSaveEdit = () => {
    if (!editedName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    onUpdate(category.id, { ...category, name: editedName });
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Category updated successfully",
    });
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) {
      toast({
        title: "Error",
        description: "Task title cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      assignedUsers: [],
    };

    onUpdate(category.id, {
      ...category,
      tasks: [...category.tasks, newTask],
    });
    setNewTaskTitle("");
    toast({
      title: "Success",
      description: "Task added successfully",
    });
  };

  const updateTask = (taskId: string, updatedTask: Task) => {
    const updatedTasks = category.tasks.map((task) =>
      task.id === taskId ? updatedTask : task
    );
    onUpdate(category.id, { ...category, tasks: updatedTasks });
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = category.tasks.filter((task) => task.id !== taskId);
    onUpdate(category.id, { ...category, tasks: updatedTasks });
    toast({
      title: "Success",
      description: "Task deleted successfully",
    });
  };

  return (
    <Accordion type="single" collapsible className="bg-card rounded-lg">
      <AccordionItem value="tasks" className="border-none">
        <div className="flex items-center justify-between px-4 py-2">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="flex-1"
              />
              <Button size="icon" variant="ghost" onClick={handleSaveEdit}>
                <Save className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditing(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              <AccordionTrigger className="hover:no-underline">
                {category.name}
              </AccordionTrigger>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="New task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addTask} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>

            <div className="space-y-2">
              {category.tasks
                .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1))
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    users={users}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                  />
                ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};