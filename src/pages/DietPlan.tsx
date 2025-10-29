import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Target, Apple, Beef, Wheat } from "lucide-react";

const DietPlan = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem("token");

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /**
   * Returns recommended macronutrient percentages based on fitness goal.
   * @param {string} goalType - One of: 'weight-loss', 'strength', 'bodybuilding', 'weight-gain', or other (defaults)
   * @returns {{ fat: number, carbs: number, protein: number }} - Percentages adding up to 100%
   */
  function getMacroPercentages(goalType) {
    const goals = {
      'weight-loss': { fat: 25, carbs: 40, protein: 35 },
      'strength': { fat: 20, carbs: 45, protein: 35 },
      'bodybuilding': { fat: 20, carbs: 40, protein: 40 },
      'weight-gain': { fat: 25, carbs: 50, protein: 25 },
      'other': { fat: 30, carbs: 40, protein: 30 },
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
      fat: Math.round((totalCalories * fat / 100) / 9),
      carbs: Math.round((totalCalories * carbs / 100) / 4),
      protein: Math.round((totalCalories * protein / 100) / 4),
    };
  }

  // Get dynamic values from profile or use defaults
  const calorieTarget = profile?.calorie || 2200;
  const goalType = profile?.goal || 'weight-loss';
  
  // Calculate macro targets using profile data
  const macroTargets = getMacroGrams(calorieTarget, goalType);

  // Dynamic daily targets based on user profile
  const dailyTargets = {
    calories: calorieTarget,
    protein: macroTargets.protein,
    fat: macroTargets.fat,
    carbs: macroTargets.carbs
  };

  // Sample meal plan data
  const mealPlan = {
    breakfast: [
      { name: "Roti(1)", calories: 120, protein: 3.6, fat: 1.2, carbs: 22 },
      { name: "Eggs(3)", calories: 210, protein: 18, fat: 15, carbs: 1.5 },
      { name: "Yogurt(100gm)", calories: 60, protein: 3.6, fat: 3.3, carbs: 4.7 },
      { name: "Mixed vegetables(200gm)", calories: 100, protein: 4, fat: 2, carbs: 15 }
    ],
    lunch: [
      { name: "Chicken/Fish(200gm)", calories: 360, protein: 62, fat: 8, carbs: 3 },
      { name: "Rice(160gm)", calories: 205, protein: 4, fat: 0.4, carbs: 45 },
      { name: "Mixed vegetables(200gm)", calories: 100, protein: 4, fat: 2, carbs: 15 }
    ],
    dinner: [
      { name: "Chicken/Fish(150gm)", calories: 300, protein: 46, fat: 7, carbs: 3 },
      { name: "Eggs(3)", calories: 210, protein: 18, fat: 15, carbs: 1.5 },
      { name: "Green salad", calories: 50, protein: 2, fat: 3, carbs: 8 },
      { name: "Yogurt(100gm)", calories: 60, protein: 3.6, fat: 3.3, carbs: 4.7 }

    ],
    snacks: [
      { name: "Protein shake", calories: 140, protein: 25, fat: 2, carbs: 15 },
      { name: "Almonds (30g)", calories: 170, protein: 6, fat: 15, carbs: 6 },
      { name: "Yogurt(100gm)", calories: 60, protein: 3.6, fat: 3.3, carbs: 4.7 }
    ]
  };

  const MacroCard = ({ icon: Icon, name, amount, unit, color }: {
    icon: any, name: string, amount: number, unit: string, color: string
  }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          <Icon className={`h-5 w-5 ${color}`} />
          <div>
            <p className="font-semibold">{amount}{unit}</p>
            <p className="text-sm text-muted-foreground">{name}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const MealSection = ({ title, meals }: { title: string, meals: any[] }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {meals.map((meal, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{meal.name}</p>
                <p className="text-sm text-muted-foreground">
                  P: {meal.protein}g | F: {meal.fat}g | C: {meal.carbs}g
                </p>
              </div>
              <Badge variant="secondary">{meal.calories} cal</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Diet Plan</h1>
        <p className="text-muted-foreground">Your personalized nutrition plan</p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading your personalized diet plan...</p>
        </div>
      ) : (
        <>
          {/* Daily Targets */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Daily Targets</span>
              </CardTitle>
              <CardDescription>
                Based on your goals and activity level - Goal: {goalType.charAt(0).toUpperCase() + goalType.slice(1)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MacroCard 
                  icon={Target} 
                  name="Calories" 
                  amount={dailyTargets.calories} 
                  unit=" kcal" 
                  color="text-primary" 
                />
                <MacroCard 
                  icon={Beef} 
                  name="Protein" 
                  amount={dailyTargets.protein} 
                  unit="g" 
                  color="text-red-500" 
                />
                <MacroCard 
                  icon={Apple} 
                  name="Fat" 
                  amount={dailyTargets.fat} 
                  unit="g" 
                  color="text-yellow-500" 
                />
                <MacroCard 
                  icon={Wheat} 
                  name="Carbs" 
                  amount={dailyTargets.carbs} 
                  unit="g" 
                  color="text-blue-500" 
                />
              </div>
            </CardContent>
          </Card>

          {/* Sample Meal Plan */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Sample Meal Plan</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <MealSection title="Breakfast" meals={mealPlan.breakfast} />
              <MealSection title="Lunch" meals={mealPlan.lunch} />
              <MealSection title="Dinner" meals={mealPlan.dinner} />
              <MealSection title="Snacks" meals={mealPlan.snacks} />
            </div>
          </div>

          {/* Macronutrient Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Macronutrient Guidelines</CardTitle>
              <CardDescription>Understanding your macro split for {goalType} goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-red-500 mb-2">
                    Protein ({getMacroPercentages(goalType).protein}% - {dailyTargets.protein}g)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Essential for muscle preservation and growth. Aim for 1.8g per kg of body weight.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold text-yellow-500 mb-2">
                    Fat ({getMacroPercentages(goalType).fat}% - {dailyTargets.fat}g)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Important for hormone production and nutrient absorption. Focus on healthy fats.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold text-blue-500 mb-2">
                    Carbohydrates ({getMacroPercentages(goalType).carbs}% - {dailyTargets.carbs}g)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Primary energy source for workouts and daily activities. Choose complex carbs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default DietPlan;