// routes/onboarding.js
import express from "express";
import pool from "../db.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// POST - Save onboarding data to profiles table
router.post("/", authenticate, async (req, res) => {
  console.log("Received onboarding update request"); // Debug log
  console.log("Request body:", req.body); // Debug log
  console.log("User ID from token:", req.user.id); // Debug log
  
  const {
    gender,
    weight,
    goalWeight,
    heightFeet,
    heightInches,
    chest,
    waist,
    thigh,
    neck,
    activityLevel,
    workoutsPerWeek,
    sessionLength,
    goal,
    dietaryPrefs,
    foodType
  } = req.body;

  try {
    // Validation for required fields
    if (!gender) {
      return res.status(400).json({ error: "Gender is required" });
    }
    if (!weight) {
      return res.status(400).json({ error: "Weight is required" });
    }
    if (!heightFeet) {
      return res.status(400).json({ error: "Height is required" });
    }

    // Calculate calorie target based on basic BMR formula and activity level
    const calculateCalories = () => {
      if (!weight || !heightFeet || !heightInches) return 2200; // Default fallback
      
      // Convert height to cm for BMR calculation
      const heightCm = (heightFeet * 30.48) + (heightInches * 2.54);
      
      // Basic BMR calculation (Mifflin-St Jeor Equation)
      let bmr;
      if (gender === 'male') {
        bmr = 10 * weight + 6.25 * heightCm - 5 * 25 + 5; // Using 25 as default age
      } else {
        bmr = 10 * weight + 6.25 * heightCm - 5 * 25 - 161; // Using 25 as default age
      }
      
      // Activity multiplier
      const activityMultipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'very': 1.725,
        'athlete': 1.9
      };
      
      const multiplier = activityMultipliers[activityLevel] || 1.55;
      let tdee = bmr * multiplier;
      
      // Adjust based on goal
      if (goal === 'weight-loss') {
        tdee -= 500; // Create deficit for weight loss
      } else if (goal === 'weight-gain') {
        tdee += 300; // Create surplus for weight gain
      } else if (goal === 'bodybuilding') {
        tdee -= 200; // Slight deficit for recomposition
      } else if (goal === 'strength') {
        // Maintain current calories for strength focus
      }
      // 'other' (maintain) - no adjustment needed
      
      return Math.round(tdee);
    };

    const calorie = calculateCalories();
    
    console.log("Calculated calorie:", calorie); // Debug log
    console.log("About to execute database query"); // Debug log

    // Insert/Update profile data
    const query = `
      INSERT INTO profiles 
      (user_id, gender, weight, goal_weight, height_feet, height_inches, chest, waist, thigh, neck, 
       activity_level, workouts_per_week, session_length, dietary_prefs, goal, calorie, food_type, 
       created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE
      gender = VALUES(gender),
      weight = VALUES(weight),
      goal_weight = VALUES(goal_weight),
      height_feet = VALUES(height_feet),
      height_inches = VALUES(height_inches),
      chest = VALUES(chest),
      waist = VALUES(waist),
      thigh = VALUES(thigh),
      neck = VALUES(neck),
      activity_level = VALUES(activity_level),
      workouts_per_week = VALUES(workouts_per_week),
      session_length = VALUES(session_length),
      dietary_prefs = VALUES(dietary_prefs),
      goal = VALUES(goal),
      calorie = VALUES(calorie),
      food_type = VALUES(food_type),
      updated_at = NOW()
    `;

    const values = [
      req.user.id,
      gender || null,
      parseFloat(weight) || null,
      parseFloat(goalWeight) || null,
      parseInt(heightFeet) || null,
      parseInt(heightInches) || null,
      parseFloat(chest) || null,
      parseFloat(waist) || null,
      parseFloat(thigh) || null,
      parseFloat(neck) || null,
      activityLevel || null,
      parseInt(workoutsPerWeek) || null,
      parseInt(sessionLength) || null,
      dietaryPrefs || null,
      goal || null,
      calorie,
      foodType || 'mixed'
    ];

    console.log("Query values:", values); // Debug log
    
    await pool.query(query, values);
    
    console.log("Database query successful"); // Debug log

    // Fetch and return the created/updated profile
    const [rows] = await pool.query(
      "SELECT * FROM profiles WHERE user_id = ?", 
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Profile not found after creation" });
    }

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile: rows[0]
    });

  } catch (err) {
    console.error("Error saving onboarding data:", err);
    console.error("Error details:", {
      message: err.message,
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage
    });
    res.status(500).json({ 
      error: "Failed to save profile data",
      details: err.message 
    });
  }
});

// GET - Fetch user profile for onboarding review
router.get("/profile", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM profiles WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

export default router;