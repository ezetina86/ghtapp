import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "../routes/authRoutes.js";
import { prismaMock } from "./__mocks__/prismaClient.js"; // Import the singleton mock
import bcrypt from "bcryptjs";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

describe("Auth Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      (prismaMock.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaMock.user.create as jest.Mock).mockResolvedValue({
        id: "1",
        email: "test@example.com",
        username: "testuser",
        displayName: "Test User",
        createdAt: new Date(),
      });

      const res = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        username: "testuser",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.user).toHaveProperty("id");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should return 409 if user already exists", async () => {
      (prismaMock.user.findFirst as jest.Mock).mockResolvedValue({ id: "1" });

      const res = await request(app).post("/api/auth/register").send({
        email: "existing@example.com",
        username: "existing",
        password: "password123",
      });

      expect(res.status).toBe(409);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully", async () => {
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        email: "test@example.com",
        username: "testuser",
        password: "hashed_password",
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty("email", "test@example.com");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should return 401 for invalid credentials", async () => {
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app).post("/api/auth/login").send({
        email: "wrong@example.com",
        password: "password123",
      });

      expect(res.status).toBe(401);
    });
  });
});
