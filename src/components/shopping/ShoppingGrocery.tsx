import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

type GroceryItem = {
  id: string;
  name: string;
  checked: boolean;
};

type GroceryCategory = {
  id: string;
  name: string;
  items: GroceryItem[];
};

const defaultCategories: GroceryCategory[] = [
  { id: "1", name: "Dairy", items: [] },
  { id: "2", name: "Meat", items: [] },
  { id: "3", name: "Grains", items: [] },
  { id: "4", name: "Produce", items: [] },
  { id: "5", name: "Beverages", items: [] },
  { id: "6", name: "Snacks", items: [] },
  { id: "7", name: "Pantry", items: [] },
  { id: "8", name: "Frozen", items: [] },
];

export function ShoppingGrocery() {
  const [categories, setCategories] = useState<GroceryCategory[]>(defaultCategories);
  const [newItemText, setNewItemText] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const addItem = (categoryId: string) => {
    if (!newItemText.trim()) return;

    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: [
            ...category.items,
            { id: Date.now().toString(), name: newItemText.trim(), checked: false }
          ]
        };
      }
      return category;
    }));
    setNewItemText("");
  };

  const toggleItem = (categoryId: string, itemId: string) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => {
            if (item.id === itemId) {
              return { ...item, checked: !item.checked };
            }
            return item;
          })
        };
      }
      return category;
    }));
  };

  const removeItem = (categoryId: string, itemId: string) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.filter(item => item.id !== itemId)
        };
      }
      return category;
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grocery List</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          {categories.map(category => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="text-lg">
                {category.name}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new item"
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addItem(category.id);
                        }
                      }}
                    />
                    <Button 
                      size="icon"
                      onClick={() => addItem(category.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {category.items.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-accent"
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={item.checked}
                            onCheckedChange={() => toggleItem(category.id, item.id)}
                          />
                          <span className={item.checked ? "line-through text-muted-foreground" : ""}>
                            {item.name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(category.id, item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}