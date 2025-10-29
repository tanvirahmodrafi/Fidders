import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const DailyLog = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [foodBank, setFoodBank] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState({});
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const token = localStorage.getItem("token");

  // --- Food Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foodForm, setFoodForm] = useState({
    name: "",
    base_weight_grams: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  // Fetch food bank
  const fetchFoodBank = async () => {
    setLoading(true);
    const res = await fetch("/api/dailylog/food-bank", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setFoodBank(data);
    setLoading(false);
  };

  // Fetch user profile for calorie target and goal type
  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/dashboard/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  useEffect(() => {
    fetchFoodBank();
    fetchProfile();
  }, []);

  // Fetch today's log entries
  const [todaysEntries, setTodaysEntries] = useState([]);
  const fetchTodaysEntries = async () => {
    const res = await fetch(
      `/api/dailylog/log?date=${selectedDate}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    setTodaysEntries(data);
  };

  useEffect(() => {
    fetchTodaysEntries();
  }, [selectedDate, selectedFoods]);

  // Handle checkbox and weight input
  const handleSelectFood = (id, checked) => {
    const food = foodBank.find((f) => f.id === id);
    setSelectedFoods((prev) => ({
      ...prev,
      [id]: checked
        ? {
          ...food,
          weight_grams: food.base_weight_grams,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
        }
        : undefined,
    }));
  };

  // Submit selected foods
  const handleSubmit = async () => {
    const entries = Object.values(selectedFoods).filter(Boolean);
    if (entries.length === 0) return;
    await fetch("/api/dailylog/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ date: selectedDate, entries }),
    });
    setSelectedFoods({});
    fetchTodaysEntries();
  };

  // Delete entry
  const handleDeleteEntry = async (entryId) => {
    await fetch(`/api/dailylog/log/${entryId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTodaysEntries();
  };

  // Add Food
  const openAddFoodModal = () => {
    setFoodForm({
      name: "",
      base_weight_grams: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
    });
    setIsModalOpen(true);
  };

  // Delete Food
  const handleDeleteFood = async (foodIds) => {
    if (!foodIds || foodIds.length === 0) {
      alert("Please select at least one food to delete.");
      return;
    }

    if (!confirm("Are you sure you want to delete the selected food(s)? This action cannot be undone.")) {
      return;
    }

    // Loop through selected IDs
    for (const foodId of foodIds) {
      await fetch(`/api/dailylog/food-bank/${foodId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    fetchFoodBank();
  };

  const handleSaveFood = async () => {
    await fetch("/api/dailylog/food-bank", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(foodForm),
    });

    setIsModalOpen(false);
    fetchFoodBank();
  };

  // Enhanced handleFoodFieldChange to auto-update nutrition based on weight
  const handleFoodFieldChange = (id, field, value) => {
    setSelectedFoods((prev) => {
      const food = foodBank.find((f) => f.id === id);
      const updated = { ...prev[id], [field]: value };

      if (field === "weight_grams" && food) {
        const ratio = value / food.base_weight_grams;

        updated.calories = (food.calories * ratio).toFixed(1);
        updated.protein = (food.protein * ratio).toFixed(1);
        updated.carbs = (food.carbs * ratio).toFixed(1);
        updated.fat = (food.fat * ratio).toFixed(1);
      }

      return { ...prev, [id]: updated };
    });
  };

  /**
 * Returns recommended macronutrient percentages based on fitness goal.
 * @param {string} goalType - One of: 'weight loss', 'strength training', 'muscle building', 'weight gain', or other (defaults)
 * @returns {{ fat: number, carbs: number, protein: number }} - Percentages adding up to 100%
 */
  function getMacroPercentages(goalType) {
    const goals = {
      'weight loss': { fat: 25, carbs: 40, protein: 35 },
      'strength training': { fat: 20, carbs: 45, protein: 35 },
      'muscle building': { fat: 20, carbs: 40, protein: 40 },
      'weight gain': { fat: 25, carbs: 50, protein: 25 },
      // Default fallback
      'default': { fat: 30, carbs: 40, protein: 30 }
    };

    // Normalize input
    const normalizedGoal = goalType?.toLowerCase().trim();

    // Return matching goal or default
    return goals[normalizedGoal] || goals['default'];
  }

  function getMacroGrams(totalCalories, goalType) {
    const { fat, carbs, protein } = getMacroPercentages(goalType);

    return {
      fat: parseFloat(((totalCalories * fat / 100) / 9).toFixed(2)),
      carbs: parseFloat(((totalCalories * carbs / 100) / 4).toFixed(2)),
      protein: parseFloat(((totalCalories * protein / 100) / 4).toFixed(2)),
    };
  }


  // Nutrition targets - get from profile data or use defaults
  const calorieTarget = profile?.calorie || 2200;
  const goalType = profile?.goal || 'weight loss';
  
  // Calculate macro targets using profile data
  const macroTargets = getMacroGrams(calorieTarget, goalType);
  const proteinTarget = macroTargets.protein;
  const carbTarget = macroTargets.carbs;
  const fatTarget = macroTargets.fat;

  // Calculate totals
  const totalCalories = todaysEntries.reduce((sum, e) => sum + Number(e.calories), 0);
  const totalProtein = todaysEntries.reduce((sum, e) => sum + Number(e.protein), 0);
  const totalCarbs = todaysEntries.reduce((sum, e) => sum + Number(e.carbs), 0);
  const totalFat = todaysEntries.reduce((sum, e) => sum + Number(e.fat), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header and Date Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Daily Food Log</h1>
          <p className="text-muted-foreground">Track your daily nutrition intake</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Label className="font-semibold mb-2 block">Select Date</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </div>

      {/* Daily Calorie Updates */}
      <Card className="mb-8 w-full">
        <CardHeader>
          <CardTitle className="text-3xl">Daily Calorie Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="font-semibold mb-2">Calories</div>
              <div>{totalCalories}/{calorieTarget}</div>
              <Progress value={parseFloat(((totalCalories / calorieTarget) * 100).toFixed(2))} />
            </div>
            <div>
              <div className="font-semibold mb-2">Carbs</div>
              <div>{totalCarbs}/{carbTarget}</div>
              <Progress value={parseFloat(((totalCarbs / carbTarget) * 100).toFixed(2))} />
            </div>
            <div>
              <div className="font-semibold mb-2">Protein</div>
              <div>{totalProtein}/{proteinTarget}</div>
              <Progress value={parseFloat(((totalProtein / proteinTarget) * 100).toFixed(2))} />
            </div>
            <div>
              <div className="font-semibold mb-2">Fat</div>
              <div>{totalFat}/{fatTarget}</div>
              <Progress value={parseFloat(((totalFat / fatTarget) * 100).toFixed(2))} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Select Foods */}
        <Card>
          <CardHeader className="flex justify-between items-center py-3 px-4">
            <div className="flex items-center" style={{ columnGap: "120px" }}>
              {/* Blue round Add button */}
              <Button
                size="icon"
                className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-blue-400 hover:bg-blue-600 text-white shadow-md"
                onClick={openAddFoodModal}
              >
                <Plus className="h-5 w-5" />
              </Button>

              <CardTitle>
                Select Foods
                <span className="ml-2 text-xs text-muted-foreground">(Choose and edit values)</span>
              </CardTitle>

              {/* Red round Delete button */}
              <Button
                size="icon"
                variant="destructive"
                className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
                onClick={() => handleDeleteFood(Object.keys(selectedFoods))} // 🔥 pass all selected IDs
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto space-y-5">
              {loading ? (
                <div>Loading...</div>
              ) : (
                foodBank.map((food) => (
                  <div key={food.id} className="flex items-center gap-4 border-b pb-2">
                    <Checkbox
                      checked={!!selectedFoods[food.id]}
                      onCheckedChange={
                        (checked) => handleSelectFood(food.id, checked)
                      }
                    />


                    <div className="flex-1 min-w-[220px]">
                      <div className="font-medium">{food.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Base: {food.base_weight_grams}g | {food.calories} kcal | P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                      </div>
                    </div>
                    {selectedFoods[food.id] && (
                      <div className="flex flex-row gap-2 items-center">
                        <Input
                          type="number"
                          min="1"
                          value={selectedFoods[food.id].weight_grams}
                          onChange={(e) => handleFoodFieldChange(food.id, "weight_grams", e.target.value)}
                          className="w-24"
                          placeholder="Weight (g)"
                        />
                        <Input
                          type="number"
                          value={selectedFoods[food.id].calories}
                          onChange={(e) => handleFoodFieldChange(food.id, "calories", e.target.value)}
                          className="w-24"
                          placeholder="Cal"
                        />
                        <Input
                          type="number"
                          value={selectedFoods[food.id].protein}
                          onChange={(e) => handleFoodFieldChange(food.id, "protein", e.target.value)}
                          className="w-24"
                          placeholder="P"
                        />
                        <Input
                          type="number"
                          value={selectedFoods[food.id].carbs}
                          onChange={(e) => handleFoodFieldChange(food.id, "carbs", e.target.value)}
                          className="w-24"
                          placeholder="C"
                        />
                        <Input
                          type="number"
                          value={selectedFoods[food.id].fat}
                          onChange={(e) => handleFoodFieldChange(food.id, "fat", e.target.value)}
                          className="w-24"
                          placeholder="F"
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            <Button className="mt-4 w-full" onClick={handleSubmit}>
              Save Food Log
            </Button>
          </CardContent>
        </Card>
        {/* Today's Entries */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Entries</CardTitle>
          </CardHeader>
          <CardContent>
            {todaysEntries.length === 0 ? (
              <div className="text-muted-foreground text-sm">No entries yet for today.</div>
            ) : (
              <div className="space-y-2">
                {todaysEntries.map((entry) => (
                  <div key={entry.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-semibold">{entry.food_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {entry.weight_grams}g | {entry.calories} kcal | P: {entry.protein}g | C: {entry.carbs}g | F: {entry.fat}g
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="rounded-full w-9 h-9 p-0 flex items-center justify-center"
                      onClick={() => handleDeleteEntry(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Food Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Food</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {["name", "base_weight_grams", "calories", "protein", "carbs", "fat"].map((field) => (
              <div key={field}>
                <Label className="capitalize">{field.replace("_", " ")}</Label>
                <Input
                  value={foodForm[field]}
                  onChange={(e) => setFoodForm({ ...foodForm, [field]: e.target.value })}
                  type={field === "name" ? "text" : "number"}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={handleSaveFood}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DailyLog;
