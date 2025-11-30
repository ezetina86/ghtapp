import request from "supertest";
import app from "../app.js";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

describe("Progress Tracking API", () => {
  let token: string;
  let userId: string;
  let bookId: string;

  beforeAll(async () => {
    // Create user
    const user = await prisma.user.create({
      data: {
        email: `progress-test-${Date.now()}@example.com`,
        username: `progresstest-${Date.now()}`,
        password: "password123",
      },
    });
    userId = user.id;
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "test-secret");

    // Create a book
    const book = await prisma.book.create({
      data: {
        userId,
        title: "Progress Test Book",
        author: "Test Author",
        totalPages: 500,
        currentPage: 100,
        status: "reading",
      },
    });
    bookId = book.id;

    // Create some reading sessions
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    await prisma.readingSession.create({
      data: {
        userId,
        bookId,
        startTime: yesterday,
        endTime: new Date(),
        durationMinutes: 60,
        pagesRead: 50,
      },
    });
  });

  afterAll(async () => {
    await prisma.readingSession.deleteMany({ where: { userId } });
    await prisma.book.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  describe("GET /api/progress/book/:bookId", () => {
    it("should return detailed book progress", async () => {
      const response = await request(app)
        .get(`/api/progress/book/${bookId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("progressPercentage");
      expect(response.body.progressPercentage).toBe(20); // 100/500 = 20%
      expect(response.body).toHaveProperty("pagesRemaining");
      expect(response.body.pagesRemaining).toBe(400);
      expect(response.body).toHaveProperty("averagePagesPerDay");
      expect(response.body).toHaveProperty("estimatedCompletionDate");
    });

    it("should return 404 for non-existent book", async () => {
      const response = await request(app)
        .get("/api/progress/book/non-existent-id")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/progress/pace", () => {
    it("should return user reading pace", async () => {
      const response = await request(app)
        .get("/api/progress/pace")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("averagePagesPerDay");
      expect(response.body).toHaveProperty("averageMinutesPerDay");
      expect(response.body).toHaveProperty("totalPages");
      expect(response.body.totalPages).toBeGreaterThanOrEqual(50);
    });
  });

  describe("GET /api/progress/history", () => {
    it("should return progress history", async () => {
      const response = await request(app)
        .get("/api/progress/history")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("date");
      expect(response.body[0]).toHaveProperty("pages");
      expect(response.body[0]).toHaveProperty("minutes");
    });
  });
});
