// server/routes/progress.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

/**
 * GET /api/progress/:userId
 * Returns progress stats for a specific user
 */
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // 1. Get latest body measurement for this user
    const [latestRows] = await pool.query(
      `SELECT * FROM body_measurements 
       WHERE userId = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId]
    );

    if (latestRows.length === 0) {
      return res.status(404).json({ error: "No measurement data found for this user." });
    }

    const latest = latestRows[0];

    // 2. Get user's goal weight from profiles table
    const [profileRows] = await pool.query(
      `SELECT goal_weight FROM profiles WHERE user_id = ? LIMIT 1`,
      [userId]
    );

    if (profileRows.length === 0) {
      return res.status(404).json({ error: "Profile not found for this user." });
    }

    const goalWeight = profileRows[0].goal_weight;

    // 3. Get weight history for progress chart (last 7 entries)
    const [historyRows] = await pool.query(
      `SELECT weight, created_at as date
       FROM body_measurements
       WHERE userId = ?
       ORDER BY created_at ASC
       LIMIT 7`,
      [userId]
    );

    const weightHistory = historyRows.map(row => ({
      date: row.date,
      weight: parseFloat(row.weight),
    }));

    // 4. Earliest weight as starting point
    const startWeight = weightHistory[0]?.weight || latest.weight;

    // 5. Calculate total loss (2 decimal places)
    const totalLoss = parseFloat(Math.abs(startWeight - latest.weight).toFixed(2));

    // 6. Calculate weekly progress dynamically
    const weeklyProgress = [];
    let totalLossSum = 0;

    for (let i = 1; i < weightHistory.length; i++) {
      const loss = weightHistory[i - 1].weight - weightHistory[i].weight;
      totalLossSum += loss;

      weeklyProgress.push({
        week: `Week ${i}`,
        loss: parseFloat(loss.toFixed(2)),
        status: loss > 1 ? "too-fast" : "on-track",
      });
    }

    // 7. Calculate dynamic weekly average
    const weeklyAverage =
      weeklyProgress.length > 0
        ? parseFloat((totalLossSum / weeklyProgress.length).toFixed(2))
        : 0;

    // 8. Final response
    return res.json({
      user: {
        weight: parseFloat(latest.weight),
        created_at: latest.created_at,
      },
      startWeight,
      goalWeight,
      totalLoss,
      weeklyAverage,
      weightHistory,
      weeklyProgress,
    });
  } catch (err) {
    console.error("Error fetching progress data:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
