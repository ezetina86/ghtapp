import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import importExportRoutes from "./routes/importExportRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || [
      "http://localhost:5000",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/data", importExportRoutes);
app.use("/api/progress", progressRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
