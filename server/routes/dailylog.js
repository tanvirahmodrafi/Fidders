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

// GET food bank items
router.get("/food-bank", authenticate, async (req, res) => {
  try {
    const [foods] = await pool.query("SELECT * FROM food_bank");
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch food bank" });
  }
});

// POST daily log entry
router.post("/log", authenticate, async (req, res) => {
  const { date, entries } = req.body; // entries: [{food_id, food_name, weight_grams, calories, carbs, protein, fat}]
  try {
    for (const entry of entries) {
      await pool.query(
        "INSERT INTO daily_logs (user_id, date, food_name, weight_grams, calories, carbs, protein, fat) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          req.user.id,
          date,
          entry.name || entry.food_name,
          entry.weight_grams,
          entry.calories,
          entry.carbs,
          entry.protein,
          entry.fat,
        ]
      );
    }
    res.json({ message: "Daily log saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save daily log" });
  }
});

// GET daily log entries
router.get("/log", authenticate, async (req, res) => {
  const { date } = req.query;
  try {
    const [logs] = await pool.query(
      "SELECT * FROM daily_logs WHERE user_id = ? AND date = ?",
      [req.user.id, date]
    );
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch daily logs" });
  }
});

// DELETE daily log entry
router.delete("/log/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      "DELETE FROM daily_logs WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );
    res.json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

// DELETE food from food_bank
router.delete("/food-bank/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM food_bank WHERE id = ?", [id]);
    res.json({ message: "Food deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete food" });
  }
});

// ADD new food to food_bank
router.post("/food-bank", authenticate, async (req, res) => {
  const { name, base_weight_grams, calories, protein, carbs, fat } = req.body;

  if (!name || !base_weight_grams || !calories) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO food_bank (name, base_weight_grams, calories, protein, carbs, fat) VALUES (?, ?, ?, ?, ?, ?)",
      [name, base_weight_grams, calories, protein, carbs, fat]
    );

    res.json({ 
      message: "Food added successfully", 
      food: { id: result.insertId, name, base_weight_grams, calories, protein, carbs, fat }
    });
  } catch (err) {
    console.error("Error adding food:", err);
    res.status(500).json({ error: "Failed to add food" });
  }
});


export default router;