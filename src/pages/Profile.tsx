import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  id?: number;
  user_id?: number;
  gender: string;
  weight: string;
  goal_weight: string;
  height_feet: string;
  height_inches: string;
  chest: string;
  waist: string;
  thigh: string;
  neck: string;
  activity_level: string;
  workouts_per_week: string;
  session_length: string;
  goal: string;
  dietary_prefs: string;
  calorie: number;
  food_type: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData>({
    gender: "",
    weight: "",
    goal_weight: "",
    height_feet: "",
    height_inches: "",
    chest: "",
    waist: "",
    thigh: "",
    neck: "",
    activity_level: "",
    workouts_per_week: "",
    session_length: "",
    goal: "",
    dietary_prefs: "",
    calorie: 2200,
    food_type: "mixed"
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { token, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // Debug log
  console.log('Profile component - Auth state:', { isAuthenticated, token: token ? 'Present' : 'Missing', user });

  useEffect(() => {
    if (!isAuthenticated || !token) {
      console.log('Not authenticated or no token, redirecting to login');
      navigate('/login');
      return;
    }
    
    console.log('User is authenticated, fetching profile...');
    fetchProfile();
  }, [isAuthenticated, token, navigate]);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile with token:', token); // Debug log
      
      const res = await fetch('/api/onboarding/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('Response status:', res.status); // Debug log
      console.log('Response headers:', res.headers.get('content-type')); // Debug log
      
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          console.log('Profile data received:', data); // Debug log
          
          setProfile({
            ...data,
            weight: data.weight?.toString() || "",
            goal_weight: data.goal_weight?.toString() || "",
            height_feet: data.height_feet?.toString() || "",
            height_inches: data.height_inches?.toString() || "",
            chest: data.chest?.toString() || "",
            waist: data.waist?.toString() || "",
            thigh: data.thigh?.toString() || "",
            neck: data.neck?.toString() || "",
            workouts_per_week: data.workouts_per_week?.toString() || "",
            session_length: data.session_length?.toString() || "",
          });
        } else {
          const textResponse = await res.text();
          console.error('Non-JSON response received:', textResponse);
          alert('Server returned unexpected response format');
        }
      } else {
        const errorText = await res.text();
        console.error('Failed to fetch profile. Status:', res.status, 'Response:', errorText);
        
        if (res.status === 404) {
          console.log('No profile found, user may need to complete onboarding');
          // Keep the default empty profile state - user can fill it out
          setProfile({
            gender: "",
            weight: "",
            goal_weight: "",
            height_feet: "",
            height_inches: "",
            chest: "",
            waist: "",
            thigh: "",
            neck: "",
            activity_level: "",
            workouts_per_week: "",
            session_length: "",
            goal: "",
            dietary_prefs: "",
            calorie: 2200,
            food_type: "mixed"
          });
        } else {
          alert(`Failed to fetch profile: ${res.status}`);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        gender: profile.gender,
        weight: profile.weight,
        goalWeight: profile.goal_weight,
        heightFeet: profile.height_feet,
        heightInches: profile.height_inches,
        chest: profile.chest,
        waist: profile.waist,
        thigh: profile.thigh,
        neck: profile.neck,
        activityLevel: profile.activity_level,
        workoutsPerWeek: profile.workouts_per_week,
        sessionLength: profile.session_length,
        goal: profile.goal,
        dietaryPrefs: profile.dietary_prefs,
        foodType: profile.food_type
      };

      console.log('Sending update data:', updateData); // Debug log

      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      console.log('Update response status:', res.status); // Debug log
      console.log('Update response headers:', res.headers.get('content-type')); // Debug log

      if (res.ok) {
        const responseData = await res.json();
        console.log('Update successful:', responseData);
        alert('Profile updated successfully!');
        fetchProfile(); // Refresh the data
      } else {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await res.json();
          console.error('Error updating profile (JSON):', error);
          alert(`Failed to update profile: ${error.error || error.message || 'Unknown error'}`);
        } else {
          const errorText = await res.text();
          console.error('Error updating profile (Text):', errorText);
          alert(`Failed to update profile. Server response: ${res.status}`);
        }
      }
    } catch (error) {
      console.error('Network error updating profile:', error);
      alert('Network error occurred. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Your Profile</h1>
        <p className="text-muted-foreground">Update your personal information and fitness preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic information about you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={profile.gender} onValueChange={(value) => updateField("gender", value)}>
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
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height_feet">Height (feet)</Label>
                <Input
                  id="height_feet"
                  type="number"
                  value={profile.height_feet}
                  onChange={(e) => updateField("height_feet", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="height_inches">Height (inches)</Label>
                <Input
                  id="height_inches"
                  type="number"
                  value={profile.height_inches}
                  onChange={(e) => updateField("height_inches", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Current Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={profile.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="goal_weight">Goal Weight (kg)</Label>
                <Input
                  id="goal_weight"
                  type="number"
                  value={profile.goal_weight}
                  onChange={(e) => updateField("goal_weight", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="calorie">Daily Calorie Target</Label>
              <Input
                id="calorie"
                type="number"
                value={profile.calorie}
                readOnly
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Automatically calculated based on your stats and goal
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Body Measurements */}
        <Card>
          <CardHeader>
            <CardTitle>Body Measurements</CardTitle>
            <CardDescription>Track your body composition changes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chest">Chest (inches)</Label>
                <Input
                  id="chest"
                  type="number"
                  value={profile.chest}
                  onChange={(e) => updateField("chest", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="waist">Waist (inches)</Label>
                <Input
                  id="waist"
                  type="number"
                  value={profile.waist}
                  onChange={(e) => updateField("waist", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="thigh">Thigh (inches)</Label>
                <Input
                  id="thigh"
                  type="number"
                  value={profile.thigh}
                  onChange={(e) => updateField("thigh", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="neck">Neck (inches)</Label>
                <Input
                  id="neck"
                  type="number"
                  value={profile.neck}
                  onChange={(e) => updateField("neck", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity & Training */}
        <Card>
          <CardHeader>
            <CardTitle>Activity & Training</CardTitle>
            <CardDescription>Your workout and activity preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="activity_level">Activity Level</Label>
              <Select value={profile.activity_level} onValueChange={(value) => updateField("activity_level", value)}>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workouts_per_week">Workouts per Week</Label>
                <Select value={profile.workouts_per_week} onValueChange={(value) => updateField("workouts_per_week", value)}>
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
                <Label htmlFor="session_length">Session Length (minutes)</Label>
                <Input
                  id="session_length"
                  type="number"
                  value={profile.session_length}
                  onChange={(e) => updateField("session_length", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals & Diet */}
        <Card>
          <CardHeader>
            <CardTitle>Goals & Diet</CardTitle>
            <CardDescription>Your fitness goals and dietary preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="goal">Primary Goal</Label>
              <Select value={profile.goal} onValueChange={(value) => updateField("goal", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strength">Strength training</SelectItem>
                  <SelectItem value="weight-loss">Lose fat aggressively (short-term)</SelectItem>
                  <SelectItem value="bodybuilding">Recomp (lose fat & build muscle)</SelectItem>
                  <SelectItem value="other">Maintain current weight</SelectItem>
                  <SelectItem value="weight-gain">Gain muscle/weight</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="food_type">Food Type Preference</Label>
              <Select value={profile.food_type} onValueChange={(value) => updateField("food_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select food type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Mixed Diet</SelectItem>
                  <SelectItem value="bangali">Bangali</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="western">Western</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dietary_prefs">Dietary Preferences & Restrictions</Label>
              <Textarea
                id="dietary_prefs"
                placeholder="e.g., Vegetarian, Halal, allergic to nuts, dislike seafood..."
                value={profile.dietary_prefs}
                onChange={(e) => updateField("dietary_prefs", e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-center">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="px-8 py-2"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default Profile;