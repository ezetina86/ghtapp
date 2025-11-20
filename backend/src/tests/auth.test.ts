import request from "supertest";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import authRoutes from "../routes/authRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Auth Routes", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        username: "testuser",
        password: "password123",
        displayName: "Test User",
      });

      expect(res.status).toBe(201);
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.token).toBeDefined();
    });

    it("should return 409 if user already exists", async () => {
      // Ensure user exists
      await prisma.user.upsert({
        where: { email: "existing@example.com" },
        update: {},
        create: {
          email: "existing@example.com",
          username: "existing",
          password: "password123",
          displayName: "Existing User",
        },
      });

      const res = await request(app).post("/api/auth/register").send({
        email: "existing@example.com",
        username: "existing",
        password: "password123",
      });

      expect(res.status).toBe(409);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeAll(async () => {
      // Create user for login
      await request(app).post("/api/auth/register").send({
        email: "login@example.com",
        username: "loginuser",
        password: "password123",
      });
    });

    it("should login successfully", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "login@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty("email", "login@example.com");
      expect(res.body.token).toBeDefined();
    });

    it("should return 401 for invalid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "login@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
    });
  });
});
