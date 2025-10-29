import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, TrendingUp, Activity } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 404) {
          // New user - redirect to onboarding
          navigate("/onboarding");
          return;
        } else {
          const result = await res.json();
          setData(result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, navigate]);

  if (loading) return <p>Loading...</p>;

  // If no data (shouldn't happen since new users are redirected)
  if (!data) {
    return <p>No data found. Redirecting...</p>;
  }

  // Show dashboard for existing users
  const calorieProgress = (data.consumedToday / data.calorieTarget) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Track your fitness journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Weigh-In</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.nextWeighIn || "Not set"}</div>
            <p className="text-xs text-muted-foreground">Weekly check-in day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Calories</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.consumedToday}/{data.calorieTarget}</div>
            <Progress value={calorieProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {data.calorieTarget - data.consumedToday} calories remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{data.weeklyProgress}</div>
            <p className="text-xs text-muted-foreground">Based on logs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.currentWeight || "N/A"}</div>
            <p className="text-xs text-muted-foreground">Goal: {data.goalWeight}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your daily routine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/log/daily">Log Today's Food</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/checkin/weekly">Weekly Weigh-In</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/progress">View Progress</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Plans</CardTitle>
            <CardDescription>Personalized nutrition and training</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild variant="outline" className="w-full">
              <Link to="/plan/diet">View Diet Plan</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/plan/workout">View Workout Plan</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link to="/chat">AI Chat Assistant</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
