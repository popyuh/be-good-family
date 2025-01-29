import { useState, KeyboardEvent } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Category = {
  name: string;
  budget: number;
  spent: number;
};

export const BudgetCategories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([
    { name: "Groceries", budget: 800, spent: 650 },
    { name: "Utilities", budget: 400, spent: 380 },
    { name: "Entertainment", budget: 300, spent: 220 },
    { name: "Transportation", budget: 200, spent: 150 },
  ]);
  
  const [newCategory, setNewCategory] = useState({ name: "", budget: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAddCategory = (e?: KeyboardEvent) => {
    if (e && e.key !== 'Enter') return;
    
    if (!newCategory.name || !newCategory.budget) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setCategories([...categories, {
      name: newCategory.name,
      budget: Number(newCategory.budget),
      spent: 0
    }]);
    setNewCategory({ name: "", budget: "" });
  };

  const handleEditCategory = (index: number, field: 'name' | 'budget', value: string) => {
    const updatedCategories = [...categories];
    if (field === 'budget') {
      updatedCategories[index] = {
        ...updatedCategories[index],
        [field]: Number(value)
      };
    } else {
      updatedCategories[index] = {
        ...updatedCategories[index],
        [field]: value
      };
    }
    setCategories(updatedCategories);
  };

  const handleDeleteCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
    toast({
      title: "Success",
      description: "Category deleted successfully",
    });
  };

  const handleCopyCategory = (category: Category) => {
    setCategories([...categories, {
      ...category,
      name: `${category.name} (Copy)`,
      spent: 0
    }]);
    toast({
      title: "Success",
      description: "Category copied successfully",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Budget Categories</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Category name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            className="w-40"
          />
          <Input
            placeholder="Budget amount"
            type="number"
            value={newCategory.budget}
            onChange={(e) => setNewCategory({ ...newCategory, budget: e.target.value })}
            onKeyPress={(e) => handleAddCategory(e as KeyboardEvent)}
            className="w-32"
          />
          <Button size="icon" onClick={() => handleAddCategory()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {categories.map((category, index) => {
          const percentage = (category.spent / category.budget) * 100;
          const isEditing = editingId === index;

          return (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Input
                        value={category.name}
                        onChange={(e) => handleEditCategory(index, 'name', e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && setEditingId(null)}
                        className="w-40"
                      />
                      <Input
                        type="number"
                        value={category.budget}
                        onChange={(e) => handleEditCategory(index, 'budget', e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && setEditingId(null)}
                        className="w-32"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${category.spent} / ${category.budget}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-1 ml-4">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => isEditing ? setEditingId(null) : setEditingId(index)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleCopyCategory(category)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteCategory(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Progress value={percentage} />
            </Card>
          );
        })}
      </div>
    </div>
  );
};