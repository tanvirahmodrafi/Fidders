import express from "express";
import pool from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware: check JWT
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

// GET profile
router.get("/", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM profiles WHERE user_id = ?", [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// CREATE / UPDATE profile
router.post("/", authenticate, async (req, res) => {
  const { gender, weight, heightFeet, heightInches, chest, waist, thigh, neck, goal, foodType } = req.body;

  try {
    await pool.query(
      `INSERT INTO profiles 
      (user_id, gender, weight, height_feet, height_inches, chest, waist, thigh, neck, goal, food_type) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      gender=VALUES(gender),
      weight=VALUES(weight),
      height_feet=VALUES(height_feet),
      height_inches=VALUES(height_inches),
      chest=VALUES(chest),
      waist=VALUES(waist),
      thigh=VALUES(thigh),
      neck=VALUES(neck),
      goal=VALUES(goal),
      food_type=VALUES(food_type)`,
      [req.user.id, gender, weight, heightFeet, heightInches, chest, waist, thigh, neck, goal, foodType]
    );

    const [rows] = await pool.query("SELECT * FROM profiles WHERE user_id = ?", [req.user.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save profile" });
  }
});

export default router;

