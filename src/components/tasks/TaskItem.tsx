import { useState } from "react";
import { Task, User } from "./TasksManager";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2, Save, Trash2, X, Users } from "lucide-react";

interface TaskItemProps {
  task: Task;
  users: User[];
  onUpdate: (taskId: string, updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskItem = ({ task, users, onUpdate, onDelete }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleSaveEdit = () => {
    if (editedTitle.trim()) {
      onUpdate(task.id, { ...task, title: editedTitle });
      setIsEditing(false);
    }
  };

  const toggleComplete = () => {
    onUpdate(task.id, {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date() : undefined,
    });
  };

  const assignUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      const isAlreadyAssigned = task.assignedUsers.some((u) => u.id === userId);
      const updatedUsers = isAlreadyAssigned
        ? task.assignedUsers.filter((u) => u.id !== userId)
        : [...task.assignedUsers, user];
      onUpdate(task.id, { ...task, assignedUsers: updatedUsers });
    }
  };

  return (
    <div
      className={`flex items-center gap-4 p-2 rounded-lg border ${
        task.completed ? "bg-muted" : "bg-card"
      }`}
    >
      <Checkbox checked={task.completed} onCheckedChange={toggleComplete} />

      <div className="flex-1">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
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
          <div className="flex items-center gap-2">
            <span
              className={`flex-1 ${
                task.completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {task.title}
            </span>
            <div className="flex items-center gap-1">
              {task.assignedUsers.map((user) => (
                <span
                  key={user.id}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                  style={{ backgroundColor: user.color }}
                  title={user.name}
                >
                  {user.emoji}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="flex items-center gap-2">
          <Select
            onValueChange={assignUser}
          >
            <SelectTrigger className="w-[40px] h-[40px] p-0">
              <SelectValue>
                <Users className="h-4 w-4" />
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.emoji}
                    </span>
                    <span>{user.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => onDelete(task.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {task.completed && task.completedAt && (
        <span className="text-xs text-muted-foreground">
          {task.completedAt.toLocaleString()}
        </span>
      )}
    </div>
  );
};