import request from "supertest";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import authRoutes from "../routes/authRoutes.js";
import bookRoutes from "../routes/bookRoutes.js";
import sessionRoutes from "../routes/sessionRoutes.js";
import goalRoutes from "../routes/goalRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/goals", goalRoutes);

const prisma = new PrismaClient();

let token: string;
let bookId: string;

beforeAll(async () => {
  // Clean up
  await prisma.goal.deleteMany();
  await prisma.readingSession.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  // Create user
  const authRes = await request(app).post("/api/auth/register").send({
    email: "goaltest@example.com",
    username: "goaltest",
    password: "password123",
  });
  token = authRes.body.token;

  // Create book
  const bookRes = await request(app)
    .post("/api/books")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Goal Test Book",
      author: "Goal Author",
      totalPages: 500,
    });
  bookId = bookRes.body.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Goal API", () => {
  let goalId: string;

  it("should create a reading goal", async () => {
    const res = await request(app)
      .post("/api/goals")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Read 30 minutes daily",
        goalType: "daily",
        targetValue: 30,
        targetUnit: "minutes",
        startDate: new Date().toISOString(),
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Read 30 minutes daily");
    expect(res.body.targetValue).toBe(30);
    expect(res.body.currentProgress).toBe(0);
    goalId = res.body.id;
  });

  it("should get all goals", async () => {
    const res = await request(app)
      .get("/api/goals")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].id).toBe(goalId);
  });

  it("should update goal progress when reading session is logged", async () => {
    // Log a reading session
    await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bookId,
        startTime: new Date().toISOString(),
        durationMinutes: 15,
        pagesRead: 10,
      });

    // Check goal progress
    const res = await request(app)
      .get(`/api/goals/${goalId}/progress`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.currentProgress).toBe(15);
    expect(res.body.progressPercentage).toBe(50);
  });

  it("should update a goal", async () => {
    const res = await request(app)
      .put(`/api/goals/${goalId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Read 45 minutes daily",
        targetValue: 45,
      });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Read 45 minutes daily");
    expect(res.body.targetValue).toBe(45);
  });

  it("should delete a goal", async () => {
    const res = await request(app)
      .delete(`/api/goals/${goalId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Goal deleted successfully");
  });
});
