import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dumbbell, Clock, TrendingUp, Calendar } from "lucide-react";

const WorkoutPlan = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem("token");

  // Fetch user profile for workout preferences
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

  // Generate workout plans based on user's goal
  const generateWorkoutPlan = (goal, workoutsPerWeek, sessionLength) => {
    const isStrengthTraining = goal === 'strength' ;
    
    if (isStrengthTraining) {
      // 5-day strength training split
      return {
        schedule: "5-Day Strength Split",
        frequency: `${workoutsPerWeek || 5} days per week`,
        sessionLength: `${sessionLength || 75} minutes`,
        workouts: [
          {
            day: "Day 1",
            title: "Chest",
            exercises: [
              { name: "Barbell Bench Press", sets: "4", reps: "4-6", rest: "3-4 min" },
              { name: "Incline Dumbbell Press", sets: "4", reps: "6-8", rest: "2-3 min" },
              { name: "Decline Bench Press", sets: "3", reps: "8-10", rest: "2 min" },
              { name: "Dumbbell Flyes", sets: "3", reps: "10-12", rest: "90s" },
              { name: "Chest Dips", sets: "3", reps: "8-12", rest: "90s" },
              { name: "Push-ups", sets: "2", reps: "Max", rest: "60s" }
            ]
          },
          {
            day: "Day 2",
            title: "Back",
            exercises: [
              { name: "Deadlift", sets: "4", reps: "4-6", rest: "3-4 min" },
              { name: "Pull-ups/Chin-ups", sets: "4", reps: "6-10", rest: "2-3 min" },
              { name: "Barbell Rows", sets: "4", reps: "6-8", rest: "2-3 min" },
              { name: "T-Bar Rows", sets: "3", reps: "8-10", rest: "2 min" },
              { name: "Lat Pulldowns", sets: "3", reps: "10-12", rest: "90s" },
              { name: "Cable Rows", sets: "3", reps: "10-12", rest: "90s" }
            ]
          },
          {
            day: "Day 3",
            title: "Legs (Quads Focus)",
            exercises: [
              { name: "Back Squat", sets: "4", reps: "4-6", rest: "3-4 min" },
              { name: "Front Squat", sets: "3", reps: "6-8", rest: "2-3 min" },
              { name: "Bulgarian Split Squats", sets: "3", reps: "8-10", rest: "2 min" },
              { name: "Leg Press", sets: "3", reps: "10-12", rest: "90s" },
              { name: "Leg Extensions", sets: "3", reps: "12-15", rest: "60s" },
              { name: "Walking Lunges", sets: "3", reps: "12-15", rest: "60s" }
            ]
          },
          {
            day: "Day 4",
            title: "Shoulders",
            exercises: [
              { name: "Overhead Press", sets: "4", reps: "4-6", rest: "3-4 min" },
              { name: "Dumbbell Shoulder Press", sets: "4", reps: "6-8", rest: "2-3 min" },
              { name: "Lateral Raises", sets: "4", reps: "10-12", rest: "90s" },
              { name: "Rear Delt Flyes", sets: "3", reps: "12-15", rest: "60s" },
              { name: "Arnold Press", sets: "3", reps: "10-12", rest: "90s" },
              { name: "Upright Rows", sets: "3", reps: "10-12", rest: "90s" }
            ]
          },
          {
            day: "Day 5",
            title: "Hamstrings & Glutes",
            exercises: [
              { name: "Romanian Deadlift", sets: "4", reps: "6-8", rest: "2-3 min" },
              { name: "Hip Thrusts", sets: "4", reps: "8-10", rest: "2-3 min" },
              { name: "Good Mornings", sets: "3", reps: "8-10", rest: "2 min" },
              { name: "Leg Curls", sets: "3", reps: "10-12", rest: "90s" },
              { name: "Single Leg RDL", sets: "3", reps: "10-12", rest: "90s" },
              { name: "Glute Bridges", sets: "3", reps: "12-15", rest: "60s" }
            ]
          }
        ]
      };
    } else {
      // 3-day Push/Pull/Legs split for other goals
      return {
        schedule: "3-Day Push/Pull/Legs",
        frequency: `${workoutsPerWeek || 3} days per week`,
        sessionLength: `${sessionLength || 60} minutes`,
        workouts: [
          {
            day: "Day 1",
            title: "Push (Chest, Shoulders, Triceps)",
            exercises: [
              { name: "Bench Press", sets: "4", reps: "6-8", rest: "2-3 min" },
              { name: "Overhead Press", sets: "3", reps: "8-10", rest: "2 min" },
              { name: "Incline Dumbbell Press", sets: "3", reps: "10-12", rest: "90s" },
              { name: "Lateral Raises", sets: "3", reps: "12-15", rest: "60s" },
              { name: "Tricep Dips", sets: "3", reps: "10-12", rest: "90s" },
              { name: "Tricep Pushdowns", sets: "3", reps: "12-15", rest: "60s" }
            ]
          },
          {
            day: "Day 2",
            title: "Pull (Back, Biceps)",
            exercises: [
              { name: "Deadlift", sets: "4", reps: "5-6", rest: "3 min" },
              { name: "Pull-ups/Lat Pulldown", sets: "4", reps: "6-10", rest: "2-3 min" },
              { name: "Barbell Rows", sets: "3", reps: "8-10", rest: "2 min" },
              { name: "Cable Rows", sets: "3", reps: "10-12", rest: "90s" },
              { name: "Barbell Curls", sets: "3", reps: "10-12", rest: "90s" },
              { name: "Hammer Curls", sets: "3", reps: "12-15", rest: "60s" }
            ]
          },
          {
            day: "Day 3",
            title: "Legs (Quads, Hamstrings, Glutes, Calves)",
            exercises: [
              { name: "Squat", sets: "4", reps: "6-8", rest: "2-3 min" },
              { name: "Romanian Deadlift", sets: "3", reps: "8-10", rest: "2 min" },
              { name: "Bulgarian Split Squats", sets: "3", reps: "10-12", rest: "90s" },
              { name: "Leg Press", sets: "3", reps: "12-15", rest: "90s" },
              { name: "Leg Curls", sets: "3", reps: "12-15", rest: "60s" },
              { name: "Calf Raises", sets: "4", reps: "15-20", rest: "60s" }
            ]
          }
        ]
      };
    }
  };

  // Get dynamic values from profile or use defaults
  const goal = profile?.goal || 'other';
  const workoutsPerWeek = profile?.workouts_per_week || 3;
  const sessionLength = profile?.session_length || 60;
  
  // Generate workout plan based on profile
  const workoutPlan = generateWorkoutPlan(goal, workoutsPerWeek, sessionLength);

  const ExerciseCard = ({ exercise }: { exercise: any }) => (
    <div className="flex justify-between items-center p-3 border rounded-lg">
      <div>
        <p className="font-medium">{exercise.name}</p>
        <p className="text-sm text-muted-foreground">Rest: {exercise.rest}</p>
      </div>
      <div className="text-right">
        <Badge variant="outline">{exercise.sets} sets</Badge>
        <p className="text-sm text-muted-foreground mt-1">{exercise.reps} reps</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Workout Plan</h1>
        <p className="text-muted-foreground">Your personalized training program</p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading your personalized workout plan...</p>
        </div>
      ) : (
        <>
          {/* Plan Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Dumbbell className="h-5 w-5" />
                <span>Plan Overview</span>
              </CardTitle>
              <CardDescription>
                Designed for {goal === 'strength' ? 'strength training' : goal} goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">{workoutPlan.schedule}</p>
                    <p className="text-sm text-muted-foreground">Training Split</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">{workoutPlan.frequency}</p>
                    <p className="text-sm text-muted-foreground">Frequency</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">{workoutPlan.sessionLength}</p>
                    <p className="text-sm text-muted-foreground">Session Length</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workout Days */}
          <div className="space-y-6">
            {workoutPlan.workouts.map((workout, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{workout.day}: {workout.title}</span>
                    <Badge variant="secondary">{workout.exercises.length} exercises</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {workout.exercises.map((exercise, exerciseIndex) => (
                      <ExerciseCard key={exerciseIndex} exercise={exercise} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progressive Overload Notes */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Progressive Overload Guidelines</CardTitle>
              <CardDescription>How to progress week by week for {goal} training</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goal === 'strength' ? (
                  <>
                    <div>
                      <h4 className="font-semibold mb-2">Week 1-2: Foundation</h4>
                      <p className="text-sm text-muted-foreground">
                        Focus on perfecting form with 70-80% of your 1RM. Master the movement patterns before adding weight.
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Week 3-4: Strength Building</h4>
                      <p className="text-sm text-muted-foreground">
                        Increase weight by 2.5-5kg when you can complete all sets with perfect form. Focus on compound movements.
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Week 5+: Peak Strength</h4>
                      <p className="text-sm text-muted-foreground">
                        Work in the 1-5 rep range for maximum strength. Take longer rest periods (3-5 minutes) between heavy sets.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h4 className="font-semibold mb-2">Week 1-2: Foundation</h4>
                      <p className="text-sm text-muted-foreground">
                        Focus on form and getting comfortable with the movements. Use lighter weights and aim for the lower rep ranges.
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Week 3-4: Progression</h4>
                      <p className="text-sm text-muted-foreground">
                        Increase weight by 2.5-5kg when you can complete all sets with good form at the higher rep range.
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Week 5+: Optimization</h4>
                      <p className="text-sm text-muted-foreground">
                        Continue progressive overload. If you can't increase weight, add an extra rep or set, or improve form/tempo.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default WorkoutPlan;