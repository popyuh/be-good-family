import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";

type WantItem = {
  id: string;
  name: string;
  notes: string;
  checked: boolean;
};

export function ShoppingWants() {
  const [items, setItems] = useState<WantItem[]>([]);
  const [newItem, setNewItem] = useState({ name: "", notes: "" });

  const addItem = () => {
    if (!newItem.name.trim()) return;

    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: newItem.name.trim(),
        notes: newItem.notes.trim(),
        checked: false,
      },
    ]);
    setNewItem({ name: "", notes: "" });
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wishlist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <Input
              placeholder="Notes (optional)"
              value={newItem.notes}
              onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
            />
          </div>
          <Button 
            onClick={addItem}
            className="w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Wishlist
          </Button>

          <div className="space-y-2">
            {items.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-accent"
              >
                <div className="flex items-center gap-2 flex-1">
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <div className={`flex-1 ${item.checked ? "line-through text-muted-foreground" : ""}`}>
                    <div className="font-medium">{item.name}</div>
                    {item.notes && (
                      <div className="text-sm text-muted-foreground">{item.notes}</div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}