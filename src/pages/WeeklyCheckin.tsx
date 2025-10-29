import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Scale, TrendingDown, TrendingUp, Target, Calendar } from "lucide-react";

const WeeklyCheckin = () => {
  const [currentWeight, setCurrentWeight] = useState("");
  const [measurements, setMeasurements] = useState({
    chest: "",
    waist: "",
    thigh: "",
    neck: ""
  });

  // Dynamic previous data from DB
  const [previousData, setPreviousData] = useState(null);

  // Profile data for goalWeight and startWeight
  const [profile, setProfile] = useState(null);

  // Fetch profile for goalWeight and startWeight
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/dashboard/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProfile(data);
  };

  // Fetch previous check-in data
  const fetchPreviousData = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/weekly-checkin/previous", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data) {
      setPreviousData({
        weight: data.weight,
        measurements: {
          chest: data.chest,
          waist: data.waist,
          thigh: data.thigh,
          neck: data.neck
        },
        date: data.created_at?.split(" ")[0] || ""
      });
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchPreviousData();
  }, []);

  // Use profile data for goalWeight and startWeight
  const goalWeight = profile?.goal_weight ?? 70;
  const startWeight = profile?.weight ?? 78.5;

  const handleSubmitCheckin = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      weight: currentWeight,
      chest: measurements.chest,
      waist: measurements.waist,
      thigh: measurements.thigh,
      neck: measurements.neck,
    };

    try {
      const res = await fetch("/api/weekly-checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save check-in");

      await fetchPreviousData(); // refresh immediately
      setCurrentWeight("");
      setMeasurements({ chest: "", waist: "", thigh: "", neck: "" });
    } catch (err) {
      console.error(err);
      alert("Error saving check-in.");
    }
  };

  const calculateProgress = () => {
    if (!currentWeight || !previousData) return null;
    const weightChange = parseFloat(currentWeight) - previousData.weight;
    const percentChange = (weightChange / previousData.weight) * 100;
    return {
      weightChange,
      percentChange: Math.abs(percentChange),
      isLoss: weightChange < 0,
      totalProgress: startWeight - parseFloat(currentWeight),
      totalGoalProgress: ((startWeight - parseFloat(currentWeight)) / (startWeight - goalWeight)) * 100
    };
  };

  const progress = calculateProgress();

  const getPaceStatus = () => {
    if (!progress) return null;

    const weeklyPercent = progress.percentChange;
    if (weeklyPercent >= 0.25 && weeklyPercent <= 1.0) {
      return { status: "On Track", color: "bg-green-500", icon: Target };
    } else if (weeklyPercent > 1.0) {
      return { status: "Too Fast", color: "bg-yellow-500", icon: TrendingDown };
    } else {
      return { status: "Too Slow", color: "bg-orange-500", icon: TrendingUp };
    }
  };

  const paceStatus = getPaceStatus();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Weekly Check-In</h1>
        <p className="text-muted-foreground">Track your weekly progress</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weight Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Scale className="h-5 w-5" />
              <span>Current Weight</span>
            </CardTitle>
            <CardDescription>
              {previousData
                ? <>Last recorded: {previousData.weight} kg on {previousData.date}</>
                : "Loading previous data..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="Enter your current weight"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                />
              </div>

              {progress && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span>Weekly Change:</span>
                    <div className="flex items-center space-x-2">
                      {progress.isLoss ? (
                        <TrendingDown className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      )}
                      <span className={progress.isLoss ? "text-green-500" : "text-red-500"}>
                        {progress.isLoss ? "-" : "+"}{Math.abs(progress.weightChange).toFixed(1)} kg
                        ({progress.percentChange.toFixed(1)}%)
                      </span>
                    </div>
                  </div>

                  {paceStatus && (
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>Pace:</span>
                      <Badge className={`${paceStatus.color} text-white`}>
                        <paceStatus.icon className="h-3 w-3 mr-1" />
                        {paceStatus.status}
                      </Badge>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress:</span>
                      <span>{progress.totalProgress.toFixed(1)} kg lost</span>
                    </div>
                    <Progress value={Math.min(progress.totalGoalProgress, 100)} />
                    <p className="text-xs text-muted-foreground">
                      {(goalWeight - parseFloat(currentWeight)).toFixed(1)} kg to goal
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Measurements Input */}
        <Card>
          <CardHeader>
            <CardTitle>Body Measurements (Optional)</CardTitle>
            <CardDescription>Track changes in body composition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="chest">Chest (inches)</Label>
                  <Input
                    id="chest"
                    type="number"
                    placeholder={previousData?.measurements.chest?.toString() || ""}
                    value={measurements.chest}
                    onChange={(e) => setMeasurements({ ...measurements, chest: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Previous: {previousData?.measurements.chest ?? "--"} cm
                  </p>
                </div>
                <div>
                  <Label htmlFor="waist">Waist (inches)</Label>
                  <Input
                    id="waist"
                    type="number"
                    placeholder={previousData?.measurements.waist?.toString() || ""}
                    value={measurements.waist}
                    onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Previous: {previousData?.measurements.waist ?? "--"} cm
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="thigh">Thigh (inches)</Label>
                  <Input
                    id="thigh"
                    type="number"
                    placeholder={previousData?.measurements.thigh?.toString() || ""}
                    value={measurements.thigh}
                    onChange={(e) => setMeasurements({ ...measurements, thigh: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Previous: {previousData?.measurements.thigh ?? "--"} cm
                  </p>
                </div>
                <div>
                  <Label htmlFor="neck">Neck (inches)</Label>
                  <Input
                    id="neck"
                    type="number"
                    placeholder={previousData?.measurements.neck?.toString() || ""}
                    value={measurements.neck}
                    onChange={(e) => setMeasurements({ ...measurements, neck: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Previous: {previousData?.measurements.neck ?? "--"} cm
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Button */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Ready to submit your check-in?</h3>
              <p className="text-sm text-muted-foreground">
                Your progress will be saved and analyzed
              </p>
            </div>
            <Button
              onClick={handleSubmitCheckin}
              disabled={!currentWeight}
              size="lg"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Submit Check-In
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {paceStatus && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paceStatus.status === "Too Fast" && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm">
                    <strong>Slow down:</strong> You're losing weight too quickly. Consider increasing your daily calories by 100-200 to preserve muscle mass.
                  </p>
                </div>
              )}
              {paceStatus.status === "Too Slow" && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm">
                    <strong>Speed up:</strong> Progress is slower than optimal. Consider reducing daily calories by 100-200 or increasing activity level.
                  </p>
                </div>
              )}
              {paceStatus.status === "On Track" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm">
                    <strong>Perfect pace:</strong> You're making excellent progress! Keep following your current plan.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeeklyCheckin;