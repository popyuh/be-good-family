import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Meal, MealType } from "@/types/meals";
import { Edit2, Save, Trash2, X, ChevronDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const WeeklyMealPlanner = () => {
  const { toast } = useToast();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [editingMeal, setEditingMeal] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const isMobile = useIsMobile();

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const fullDayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

  // Convert Sunday-based index (0-6) to Monday-based index (0-6)
  const convertToMondayBasedIndex = (sundayBasedIndex: number) => {
    return (sundayBasedIndex + 6) % 7;
  };

  // Convert Monday-based index (0-6) to Sunday-based index (0-6)
  const convertToSundayBasedIndex = (mondayBasedIndex: number) => {
    return (mondayBasedIndex + 1) % 7;
  };

  const addMeal = (dayOfWeek: number, type: MealType) => {
    const newMeal: Meal = {
      id: `${Date.now()}`,
      type,
      name: "",
      dayOfWeek: convertToSundayBasedIndex(dayOfWeek),
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

  const getMealsForDay = (mondayBasedIndex: number) => {
    const sundayBasedIndex = convertToSundayBasedIndex(mondayBasedIndex);
    return meals.filter((meal) => meal.dayOfWeek === sundayBasedIndex);
  };

  const renderMealList = (dayMeals: Meal[]) => {
    return mealTypes.map((type) => {
      const meal = dayMeals.find((m) => m.type === type);
      return (
        <div key={type} className="py-2">
          {meal ? (
            <div className="flex items-center justify-between gap-2 px-2">
              <div className="flex-1">
                <span className="text-sm font-medium capitalize">{type}:</span>
                {editingMeal === meal.id ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Enter meal"
                      className="h-8"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => updateMeal(meal.id)}
                      className="h-8 w-8"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingMeal(null)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className="text-sm break-words">{meal.name}</span>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditingMeal(meal.id);
                          setEditedName(meal.name);
                        }}
                        className="h-8 w-8"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteMeal(meal.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="px-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground"
                onClick={() => addMeal(dayMeals[0]?.dayOfWeek || 0, type)}
              >
                <span className="capitalize">Add {type}</span>
              </Button>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-full space-y-4">
      {daysOfWeek.map((day, index) => {
        const dayMeals = getMealsForDay(index);
        return (
          <Collapsible key={day} className="border rounded-lg">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  <span className="md:hidden">{day}</span>
                  <span className="hidden md:inline">{fullDayNames[index]}</span>
                </span>
                {dayMeals.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({dayMeals.length} meals)
                  </span>
                )}
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              {renderMealList(dayMeals)}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};