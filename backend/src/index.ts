import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5001;

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

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
