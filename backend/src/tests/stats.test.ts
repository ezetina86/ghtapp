import request from "supertest";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import authRoutes from "../routes/authRoutes.js";
import bookRoutes from "../routes/bookRoutes.js";
import sessionRoutes from "../routes/sessionRoutes.js";
import statsRoutes from "../routes/statsRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/stats", statsRoutes);

const prisma = new PrismaClient();

let token: string;
let bookId: string;

beforeAll(async () => {
  // Clean up
  await prisma.readingSession.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  // Create user
  const authRes = await request(app).post("/api/auth/register").send({
    email: "statstest@example.com",
    username: "statstest",
    password: "password123",
  });
  token = authRes.body.token;

  // Create book
  const bookRes = await request(app)
    .post("/api/books")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Stats Test Book",
      author: "Stats Author",
      totalPages: 400,
    });
  bookId = bookRes.body.id;

  // Create some reading sessions
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  await request(app)
    .post("/api/sessions")
    .set("Authorization", `Bearer ${token}`)
    .send({
      bookId,
      startTime: today.toISOString(),
      durationMinutes: 30,
      pagesRead: 15,
    });

  await request(app)
    .post("/api/sessions")
    .set("Authorization", `Bearer ${token}`)
    .send({
      bookId,
      startTime: yesterday.toISOString(),
      durationMinutes: 45,
      pagesRead: 20,
    });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Stats API", () => {
  it("should get session stats", async () => {
    const res = await request(app)
      .get("/api/sessions/stats")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.totalSessions).toBe(2);
    expect(res.body.totalDuration).toBe(75);
    expect(res.body.totalPages).toBe(35);
    expect(res.body.currentStreak).toBeGreaterThanOrEqual(0);
  });

  it("should get daily reading history", async () => {
    const res = await request(app)
      .get("/api/stats/daily-history?days=7")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("date");
    expect(res.body[0]).toHaveProperty("totalMinutes");
    expect(res.body[0]).toHaveProperty("totalPages");
    expect(res.body[0]).toHaveProperty("sessionCount");
  });

  it("should get book stats", async () => {
    const res = await request(app)
      .get("/api/stats/books")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalBooks");
    expect(res.body).toHaveProperty("readingBooks");
    expect(res.body).toHaveProperty("completedBooks");
    expect(res.body).toHaveProperty("toReadBooks");
    expect(res.body).toHaveProperty("mostReadBooks");
    expect(Array.isArray(res.body.mostReadBooks)).toBe(true);
  });

  it("should get reading pace", async () => {
    const res = await request(app)
      .get("/api/stats/reading-pace")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("averagePagesPerSession");
    expect(res.body).toHaveProperty("averageMinutesPerSession");
    expect(res.body).toHaveProperty("pagesPerMinute");
    expect(res.body.averagePagesPerSession).toBeGreaterThan(0);
    expect(res.body.averageMinutesPerSession).toBeGreaterThan(0);
  });

  it("should return empty stats for user with no sessions", async () => {
    // Create a new user with no sessions
    const newUserRes = await request(app).post("/api/auth/register").send({
      email: "nostats@example.com",
      username: "nostats",
      password: "password123",
    });
    const newToken = newUserRes.body.token;

    const res = await request(app)
      .get("/api/stats/reading-pace")
      .set("Authorization", `Bearer ${newToken}`);

    expect(res.status).toBe(200);
    expect(res.body.averagePagesPerSession).toBe(0);
    expect(res.body.averageMinutesPerSession).toBe(0);
  });
});
