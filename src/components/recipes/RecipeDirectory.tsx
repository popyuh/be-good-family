import { useState } from "react";
import { Recipe, RecipeCategory } from "@/types/recipes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export const RecipeDirectory = () => {
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [importText, setImportText] = useState("");
  const [recipeTitle, setRecipeTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory>("Main Dishes");

  const categories: RecipeCategory[] = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Desserts",
    "Snacks",
    "Beverages",
    "Appetizers",
    "Soups",
    "Salads",
    "Main Dishes",
    "Side Dishes"
  ];

  const parseImportedRecipe = (text: string): Partial<Recipe> => {
    // Basic parsing logic - can be enhanced for better recognition
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    
    return {
      name: recipeTitle || "New Recipe",
      ingredients: lines.filter(line => line.includes('•') || line.includes('-')),
      instructions: lines.filter(line => /^\d+\./.test(line)),
      category: selectedCategory,
      notes: ""
    };
  };

  const handleImport = () => {
    try {
      const parsedRecipe = parseImportedRecipe(importText);
      const newRecipe: Recipe = {
        id: Date.now().toString(),
        name: parsedRecipe.name || "New Recipe",
        category: parsedRecipe.category || "Main Dishes",
        ingredients: parsedRecipe.ingredients || [],
        instructions: parsedRecipe.instructions || [],
        notes: "",
      };

      setRecipes([...recipes, newRecipe]);
      setImportText("");
      setRecipeTitle("");
      toast({
        title: "Success",
        description: "Recipe imported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import recipe. Please check the format.",
        variant: "destructive",
      });
    }
  };

  const getRecipesByCategory = (category: RecipeCategory) => {
    return recipes
      .filter(recipe => recipe.category === category)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Recipe</CardTitle>
          <CardDescription>
            Copy and paste a recipe from any website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="recipe-title" className="text-sm font-medium">
                Recipe Title
              </label>
              <Input
                id="recipe-title"
                value={recipeTitle}
                onChange={(e) => setRecipeTitle(e.target.value)}
                placeholder="Enter recipe title"
                className="max-w-md"
              />
            </div>
            <Textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste recipe content here..."
              className="min-h-[200px]"
            />
            <div className="flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as RecipeCategory)}
                className="border rounded p-2"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <Button onClick={handleImport}>
                <Plus className="h-4 w-4 mr-2" />
                Import Recipe
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="w-full flex-wrap h-auto">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getRecipesByCategory(category).map((recipe) => (
                <Card key={recipe.id}>
                  <CardHeader>
                    <CardTitle>{recipe.name}</CardTitle>
                    <CardDescription>{recipe.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Ingredients:</h4>
                        <ul className="list-disc pl-4">
                          {recipe.ingredients.map((ingredient, idx) => (
                            <li key={idx}>{ingredient}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Instructions:</h4>
                        <ol className="list-decimal pl-4">
                          {recipe.instructions.map((instruction, idx) => (
                            <li key={idx}>{instruction}</li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Notes:</h4>
                        <Textarea
                          value={recipe.notes}
                          onChange={(e) => {
                            const updatedRecipes = recipes.map(r =>
                              r.id === recipe.id
                                ? { ...r, notes: e.target.value }
                                : r
                            );
                            setRecipes(updatedRecipes);
                          }}
                          placeholder="Add notes about this recipe..."
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};