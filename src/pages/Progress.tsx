import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, Target, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface WeightHistoryEntry {
  date: string;
  weight: number;
}

interface WeeklyProgressEntry {
  week: string;
  loss: number;
  status: string;
}

interface ProgressData {
  user: {
    weight: number;
    created_at: string;
  };
  startWeight: number;
  goalWeight: number;
  totalLoss: number;
  weeklyAverage: number;
  weightHistory: WeightHistoryEntry[];
  weeklyProgress: WeeklyProgressEntry[];
}

const Progress = () => {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Get the actual logged-in user ID
  const userId = user?.id;
  
  console.log('Progress component - Auth state:', { isAuthenticated, user, userId }); // Debug log

  useEffect(() => {
    const fetchProgress = async () => {
      // Check if user is authenticated and has an ID
      if (!isAuthenticated) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      if (!userId) {
        // Fallback: Try to get user ID from token
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const tokenUserId = payload.id;
            console.log('Fallback: Using user ID from token:', tokenUserId); // Debug log
            
            if (tokenUserId) {
              const res = await fetch(`/api/progress/${tokenUserId}`);
              if (!res.ok) throw new Error("Failed to fetch progress data");
              const data = await res.json();
              setProgressData(data);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error('Error decoding token:', err);
          }
        }
        setError("User ID not available - please log out and log in again");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/progress/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch progress data");
        const data = await res.json();
        setProgressData(data);
      } catch (err) {
        console.error("Error fetching progress data:", err);
        setError("Unable to load progress data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId, isAuthenticated]);

  const getPaceColor = (status: string) => {
    switch (status) {
      case "on-track": return "bg-green-500";
      case "too-fast": return "bg-yellow-500";
      case "too-slow": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getPaceIcon = (status: string) => {
    switch (status) {
      case "on-track": return Target;
      case "too-fast": return TrendingDown;
      case "too-slow": return TrendingUp;
      default: return Target;
    }
  };

  const calculateProgress = () => {
    if (!progressData) return 0;
    const totalGoal = progressData.startWeight - progressData.goalWeight;
    const currentProgress = progressData.startWeight - progressData.user.weight;

    const ans = (currentProgress / totalGoal) * 100;
    if (ans < 0) return 0;
    if (ans > 100) return 100;

    return ans;
  };

  const estimatedCompletion = () => {
    if (!progressData) return { weeks: 0, date: "" };
    const remaining = progressData.user.weight - progressData.goalWeight;
    const weeksRemaining = Math.ceil(remaining / progressData.weeklyAverage);

    if (weeksRemaining <= 0) {
      return { weeks: 0, date: "Goal Achieved!" };
    }

    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + (weeksRemaining * 7));
    return {
      weeks: weeksRemaining,
      date: completionDate.toLocaleDateString(),
    };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading progress data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>No progress data available.</p>
      </div>
    );
  }

  const completion = estimatedCompletion();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Progress Analytics</h1>
        <p className="text-muted-foreground">Track your fitness journey over time</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Weight</p>
                <p className="text-2xl font-bold">{progressData.user.weight} kg</p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Lost</p>
                <p className="text-2xl font-bold text-green-500">-{progressData.totalLoss} kg</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weekly Average</p>
                <p className="text-2xl font-bold">-{progressData.weeklyAverage} kg</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Pace</p>
                <Badge className="bg-green-500 text-white">
                  <Target className="h-3 w-3 mr-1" />
                  {calculateProgress() >= 50 ? "On Track" : "Needs Attention"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weight Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weight Progress Over Time</CardTitle>
            <CardDescription>Your weight journey visualization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Start: {progressData.startWeight} kg</span>
                  <span>Goal: {progressData.goalWeight} kg</span>
                </div>
                <div className="w-full bg-muted rounded-full h-4">
                  <div
                    className="bg-primary h-4 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(calculateProgress(), 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-center mt-2 text-muted-foreground">
                  {calculateProgress().toFixed(1)}% to goal
                </p>
              </div>

              {/* Recent weight entries */}
              <div className="space-y-2">
                <h4 className="font-semibold">Recent Entries</h4>
                {progressData.weightHistory.slice(-5).map((entry, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">{new Date(entry.date).toLocaleDateString()}</span>
                    <span className="font-medium">{entry.weight} kg</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Pace Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Pace Analysis</CardTitle>
            <CardDescription>How you're progressing week by week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {progressData.weeklyProgress.map((week, index) => {
                const PaceIcon = getPaceIcon(week.status);
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <PaceIcon
                        className={`h-4 w-4 ${
                          week.status === "on-track"
                            ? "text-green-500"
                            : week.status === "too-fast"
                            ? "text-yellow-500"
                            : "text-orange-500"
                        }`}
                      />
                      <span className="font-medium">{week.week}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-500">-{week.loss} kg</p>
                      <Badge
                        variant="outline"
                        className={`${getPaceColor(week.status)} text-white border-transparent`}
                      >
                        {week.status.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Goal Projection */}
        <Card>
          <CardHeader>
            <CardTitle>Goal Projection</CardTitle>
            <CardDescription>Estimated completion timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{completion.weeks} weeks</p>
                <p className="text-muted-foreground">Estimated time to goal</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">{completion.date}</p>
                <p className="text-muted-foreground">Projected completion date</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Based on your current average weekly loss of {progressData.weeklyAverage} kg,
                  you're on track to reach your goal weight of {progressData.goalWeight} kg.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Adherence Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Adherence Statistics</CardTitle>
            <CardDescription>How consistently you're following the plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Weekly Check-ins</span>
                <Badge variant="outline">6/6 completed</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Days with Food Logs</span>
                <Badge variant="outline">38/42 days</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Target Pace Adherence</span>
                <Badge className="bg-green-500">83% on track</Badge>
              </div>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Excellent consistency!</strong> Your regular check-ins and food logging
                  are key factors in your successful progress.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;
