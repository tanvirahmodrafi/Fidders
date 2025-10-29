// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import profileRoutes from "./routes/profile.js";
import dailylogRoutes from "./routes/dailylog.js";
import weeklyCheckinRoutes from "./routes/weekly-checkin.js";
import progressRoutes from "./routes/progress.js";
import onboardingRoutes from "./routes/onboarding.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/dashboard/profile", profileRoutes);
app.use("/api/dailylog", dailylogRoutes);
app.use("/api/weekly-checkin", weeklyCheckinRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/onboarding", onboardingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
