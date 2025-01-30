import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Meal, MealType } from "@/types/meals";
import { Edit2, Save, Trash2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

export const WeeklyMealPlanner = () => {
  const { toast } = useToast();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [editingMeal, setEditingMeal] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const isMobile = useIsMobile();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const fullDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
    <div className="w-full">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th className="p-2 md:p-4 border bg-muted text-left min-w-[80px]"></th>
              {daysOfWeek.map((day, index) => (
                <th key={day} className="p-2 md:p-4 border bg-muted font-medium text-left">
                  <span className="hidden md:inline">{fullDayNames[index]}</span>
                  <span className="md:hidden">{day}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mealTypes.map((type) => (
              <tr key={type}>
                <td className="p-2 md:p-4 border bg-muted font-medium capitalize text-left">
                  {type}
                </td>
                {daysOfWeek.map((_, index) => {
                  const meal = getMeal(index, type);
                  return (
                    <td key={index} className="p-2 md:p-4 border min-w-[120px]">
                      {meal ? (
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                          {editingMeal === meal.id ? (
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full">
                              <Input
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                placeholder="Enter meal"
                                className="min-w-[100px] max-w-[150px]"
                              />
                              <div className="flex gap-1">
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
                            </div>
                          ) : (
                            <>
                              <span className="flex-1 break-words">{meal.name}</span>
                              <div className="flex gap-1">
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
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          className="w-full text-xs md:text-sm"
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