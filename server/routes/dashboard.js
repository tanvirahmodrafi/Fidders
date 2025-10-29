import express from "express";
import pool from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware: Verify JWT
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// GET dashboard summary
router.get("/", authenticate, async (req, res) => {
  try {
    // Get most recent profile with calorie data
    const [profiles] = await pool.query(
      "SELECT * FROM profiles WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1",
      [req.user.id]
    );
    if (profiles.length === 0) {
      return res.status(404).json({ error: "No profile found" });
    }
    const profile = profiles[0];

    // Get latest checkin
    const [checkins] = await pool.query(
      "SELECT * FROM checkins WHERE user_id = ? ORDER BY date DESC LIMIT 1",
      [req.user.id]
    );
    const latestCheckin = checkins[0] || null;

    // Get most recent body measurements for current weight
    const [bodyMeasurements] = await pool.query(
      "SELECT * FROM body_measurements WHERE userId = ? ORDER BY updated_at DESC LIMIT 1",
      [req.user.id]
    );
    const latestBodyMeasurement = bodyMeasurements[0] || null;

    // Get today's log
    const [logs] = await pool.query(
      "SELECT * FROM daily_logs WHERE user_id = ? AND date = CURDATE()",
      [req.user.id]
    );
    const todayLog = logs[0] || null;

    // Calculate fields for dashboard using most recent data
    const calorieTarget = profile.calorie || 2200; // Use profile calorie or default
    const consumedToday = todayLog ? todayLog.calories : 0;
    const weeklyProgress = latestCheckin ? "On Track" : "No data";
    // Use most recent weight from body_measurements, then checkin, then profile
    const currentWeight = latestBodyMeasurement?.weight || latestCheckin?.weight || profile.weight;
    const goalWeight = profile.goal === "weight-loss" ? "70 kg" : "N/A";
    const nextWeighIn = "Friday, Sep 15"; // You can calculate this

    res.json({
      nextWeighIn,
      calorieTarget,
      consumedToday,
      weeklyProgress,
      currentWeight,
      goalWeight,
      // Optionally send raw data too
      profile,
      latestCheckin,
      latestBodyMeasurement,
      todayLog,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

// POST new daily log
router.post("/log", authenticate, async (req, res) => {
  const { calories, protein, carbs, fat } = req.body;
  try {
    await pool.query(
      "INSERT INTO daily_logs (user_id, date, calories, protein, carbs, fat) VALUES (?, CURDATE(), ?, ?, ?, ?)",
      [req.user.id, calories, protein, carbs, fat]
    );
    res.json({ message: "Log created" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save log" });
  }
});

// GET profile data
router.get("/profile", authenticate, async (req, res) => {
  try {
    const [profiles] = await pool.query(
      "SELECT * FROM profiles WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1",
      [req.user.id]
    );
    
    if (profiles.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(profiles[0]);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// POST new profile
router.post("/profile", authenticate, async (req, res) => {
  const { gender, weight, heightFeet, heightInches, chest, waist, thigh, neck, goal, foodType } = req.body;
  try {
    await pool.query(
      "INSERT INTO profiles (user_id, gender, weight, height_feet, height_inches, chest, waist, thigh, neck, goal, food_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [req.user.id, gender, weight, heightFeet, heightInches, chest, waist, thigh, neck, goal, foodType]
    );
    res.json({ message: "Profile created" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save profile" });
  }
});

export default router;

