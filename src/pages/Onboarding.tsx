import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Profile
    gender: "",
    dateOfBirth: "",
    height: "",
    heightFeet: "",
    heightInches: "",
    weight: "",
    goalWeight: "",
    // Measurements
    chest: "",
    waist: "",
    thigh: "",
    neck: "",
    // Activity
    activityLevel: "",
    workoutsPerWeek: "",
    sessionLength: "",
    // Goals
    goal: "",
    // Dietary preferences
    dietaryPrefs: ""
  });

  const navigate = useNavigate();
  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding by submitting data
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No auth token found");
          alert("Authentication error. Please log in again.");
          return;
        }

        // Basic validation
        if (!formData.gender || !formData.weight || !formData.goal) {
          alert("Please fill in all required fields (gender, weight, and goal).");
          return;
        }

        // Map the form data to match the backend expected format
        const profileData = {
          gender: formData.gender,
          weight: formData.weight,
          goalWeight: formData.goalWeight,
          heightFeet: formData.heightFeet,
          heightInches: formData.heightInches,
          chest: formData.chest,
          waist: formData.waist,
          thigh: formData.thigh,
          neck: formData.neck,
          activityLevel: formData.activityLevel,
          workoutsPerWeek: formData.workoutsPerWeek,
          sessionLength: formData.sessionLength,
          goal: formData.goal, // This is the primary fitness goal (cut, bulk, etc.)
          dietaryPrefs: formData.dietaryPrefs,
          foodType: "mixed" // Default food type, can be changed in profile later
        };

        console.log("Submitting profile data:", profileData); // Debug log

        const res = await fetch("/api/onboarding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        });

        if (res.ok) {
          // Redirect to dashboard after successful profile creation
          navigate("/dashboard");
        } else {
          const error = await res.json();
          console.error("Error saving profile:", error);
          alert("Failed to save profile. Please try again.");
        }
      } catch (error) {
        console.error("Error during profile submission:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth (Optional)</Label>
                <Input 
                  id="dob" 
                  type="date" 
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="height">Height (feet)</Label>
                <Input 
                  id="height" 
                  type="number" 
                  placeholder="5"
                  value={formData.heightFeet}
                  onChange={(e) => updateFormData("heightFeet", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="height">Height (inches)</Label>
                <Input 
                  id="height" 
                  type="number" 
                  placeholder="10"
                  value={formData.heightInches}
                  onChange={(e) => updateFormData("heightInches", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="weight">Current Weight (kg)</Label>
                <Input 
                  id="weight" 
                  type="number" 
                  placeholder="70"
                  value={formData.weight}
                  onChange={(e) => updateFormData("weight", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="goal">Weight Goal (kg)</Label>
                <Input 
                  id="goal" 
                  type="number" 
                  placeholder="65"
                  value={formData.goalWeight}
                  onChange={(e) => updateFormData("goalWeight", e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Body Measurements</h2>
            <p className="text-muted-foreground mb-4">These help us track your progress more accurately</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chest">Chest (inches)</Label>
                <Input 
                  id="chest" 
                  type="number" 
                  placeholder="36"
                  value={formData.chest}
                  onChange={(e) => updateFormData("chest", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="waist">Waist (inches)</Label>
                <Input 
                  id="waist" 
                  type="number" 
                  placeholder="32"
                  value={formData.waist}
                  onChange={(e) => updateFormData("waist", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="thigh">Thigh (inches)</Label>
                <Input 
                  id="thigh" 
                  type="number" 
                  placeholder="22"
                  value={formData.thigh}
                  onChange={(e) => updateFormData("thigh", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="neck">Neck (inches)</Label>
                <Input 
                  id="neck" 
                  type="number" 
                  placeholder="11"
                  value={formData.neck}
                  onChange={(e) => updateFormData("neck", e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Activity & Training</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="activity">Activity Level</Label>
                <Select value={formData.activityLevel} onValueChange={(value) => updateFormData("activityLevel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (desk job, no exercise)</SelectItem>
                    <SelectItem value="light">Lightly Active (light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="very">Very Active (hard exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="athlete">Athlete (very hard exercise, physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="workouts">Workouts per Week</Label>
                <Select value={formData.workoutsPerWeek} onValueChange={(value) => updateFormData("workoutsPerWeek", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workout frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} days</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="session">Session Length (minutes)</Label>
                <Input 
                  id="session" 
                  type="number" 
                  placeholder="60"
                  value={formData.sessionLength}
                  onChange={(e) => updateFormData("sessionLength", e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Your Goal</h2>
            <div>
              <Label htmlFor="goal">What's your primary goal?</Label>
              <Select value={formData.goal} onValueChange={(value) => updateFormData("goal", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight-loss">Lose weight while preserving muscle mass</SelectItem>
                  <SelectItem value="weight-loss">Lose fat aggressively (short-term)</SelectItem>
                  <SelectItem value="bodybuilding">Recomp (lose fat & build muscle)</SelectItem>
                  <SelectItem value="other">Maintain current weight</SelectItem>
                  <SelectItem value="weight-gain">Gain muscle/weight</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Dietary Preferences</h2>
            <div>
              <Label htmlFor="dietary">Dietary Preferences & Restrictions</Label>
              <Textarea 
                id="dietary"
                placeholder="e.g., Vegetarian, Halal, allergic to nuts, dislike seafood..."
                value={formData.dietaryPrefs}
                onChange={(e) => updateFormData("dietaryPrefs", e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Ready to get started!</h3>
              <p className="text-sm text-muted-foreground">
                We'll use this information to create your personalized diet and workout plans.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to FIDEERS</h1>
        <p className="text-muted-foreground">Let's set up your personalized fitness plan</p>
        <div className="mt-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">Step {step} of {totalSteps}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Step {step} of {totalSteps}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={step === 1}
            >
              Previous
            </Button>
            <Button onClick={handleNext}>
              {step === totalSteps ? "Complete Setup" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* BMR and TDEE Information */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Understanding Your BMR and TDEE</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Your Basal Metabolic Rate (BMR) is the number of calories your body needs at rest to maintain vital functions.
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Total Daily Energy Expenditure (TDEE) is an estimate of how many calories you burn per day when exercise is taken into account.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold">BMR Calculation</h4>
            <p className="text-sm text-muted-foreground">
              Male: <code className="bg-muted px-1 py-0.5 rounded">BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5</code>
            </p>
            <p className="text-sm text-muted-foreground">
              Female: <code className="bg-muted px-1 py-0.5 rounded">BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161</code>
            </p>
          </div>
          <div>
            <h4 className="font-semibold">TDEE Calculation</h4>
            <p className="text-sm text-muted-foreground">
              TDEE = BMR × Activity Level
            </p>
            <p className="text-sm text-muted-foreground">
              Goal Adjustments:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>Weight loss: TDEE - 500 (1lb/week deficit)</li>
              <li>Bulk: TDEE + 300 (moderate surplus)</li>
              <li>Maintain: TDEE (no change)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;