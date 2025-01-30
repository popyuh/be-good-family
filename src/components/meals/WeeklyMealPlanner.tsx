import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Meal, MealType } from "@/types/meals";
import { Edit2, Save, Trash2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const WeeklyMealPlanner = () => {
  const { toast } = useToast();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [editingMeal, setEditingMeal] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"];

  const addMeal = (dayOfWeek: number, type: MealType) => {
    const newMeal: Meal = {
      id: `${Date.now()}`,
      type,
      name: "",
      dayOfWeek,
    };
    setMeals([...meals, newMeal]);
    setEditingMeal(newMeal.id);
    setEditedName("");
  };

  const updateMeal = (mealId: string) => {
    if (editedName.trim()) {
      setMeals(
        meals.map((meal) =>
          meal.id === mealId ? { ...meal, name: editedName } : meal
        )
      );
      setEditingMeal(null);
      setEditedName("");
      toast({
        title: "Success",
        description: "Meal updated successfully",
      });
    }
  };

  const deleteMeal = (mealId: string) => {
    setMeals(meals.filter((meal) => meal.id !== mealId));
    toast({
      title: "Success",
      description: "Meal deleted successfully",
    });
  };

  const getMeal = (dayOfWeek: number, type: MealType) => {
    return meals.find((meal) => meal.dayOfWeek === dayOfWeek && meal.type === type);
  };

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 border bg-muted"></th>
              {daysOfWeek.map((day) => (
                <th key={day} className="p-4 border bg-muted font-medium">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mealTypes.map((type) => (
              <tr key={type}>
                <td className="p-4 border bg-muted font-medium capitalize">
                  {type}
                </td>
                {daysOfWeek.map((_, index) => {
                  const meal = getMeal(index, type);
                  return (
                    <td key={index} className="p-4 border">
                      {meal ? (
                        <div className="flex items-center gap-2">
                          {editingMeal === meal.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                placeholder="Enter meal name"
                                className="min-w-[150px]"
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => updateMeal(meal.id)}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setEditingMeal(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <span className="flex-1">{meal.name}</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                  setEditingMeal(meal.id);
                                  setEditedName(meal.name);
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => deleteMeal(meal.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={() => addMeal(index, type)}
                        >
                          Add {type}
                        </Button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};