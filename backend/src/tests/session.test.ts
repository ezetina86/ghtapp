import request from "supertest";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import authRoutes from "../routes/authRoutes.js";
import bookRoutes from "../routes/bookRoutes.js";
import sessionRoutes from "../routes/sessionRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/sessions", sessionRoutes);

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
    email: "sessiontest@example.com",
    username: "sessiontest",
    password: "password123",
  });
  token = authRes.body.token;

  // Create book
  const bookRes = await request(app)
    .post("/api/books")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Session Test Book",
      author: "Session Author",
      totalPages: 200,
    });
  bookId = bookRes.body.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Session API", () => {
  let sessionId: string;

  it("should create a reading session", async () => {
    const startTime = new Date();
    const res = await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bookId,
        startTime,
        durationMinutes: 30,
        pagesRead: 15,
        notes: "Good session",
      });

    expect(res.status).toBe(201);
    expect(res.body.bookId).toBe(bookId);
    expect(res.body.pagesRead).toBe(15);
    sessionId = res.body.id;
  });

  it("should get sessions for a book", async () => {
    const res = await request(app)
      .get(`/api/sessions?bookId=${bookId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.sessions.length).toBeGreaterThan(0);
    expect(res.body.sessions[0].id).toBe(sessionId);
  });

  it("should update a session", async () => {
    const res = await request(app)
      .put(`/api/sessions/${sessionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        notes: "Updated notes",
      });

    expect(res.status).toBe(200);
    expect(res.body.notes).toBe("Updated notes");
  });

  it("should delete a session", async () => {
    const res = await request(app)
      .delete(`/api/sessions/${sessionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Session deleted successfully");
  });
});
