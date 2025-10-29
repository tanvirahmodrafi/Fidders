import express from "express";
import pool from "../db.js";         // adjust path if needed
import authenticate from "../middleware/authenticate.js"; // adjust if you have it

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  const { weight, chest, waist, thigh, neck } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO body_measurements 
        (userId, weight, chest, waist, thigh, neck, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [req.user.id, weight, chest, waist, thigh, neck]
    );

    res.json({ message: "Check-in saved", insertId: result.insertId });
  } catch (err) {
    console.error("Error inserting check-in:", err);
    res.status(500).json({ error: "Failed to save check-in" });
  }
});

router.get("/previous", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT weight, chest, waist, thigh, neck, created_at
       FROM body_measurements
       WHERE userId = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.json(null);
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching previous check-in:", err);
    res.status(500).json({ error: "Failed to fetch previous check-in" });
  }
});
export default router;
