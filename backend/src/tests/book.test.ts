import request from "supertest";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import authRoutes from "../routes/authRoutes.js";
import bookRoutes from "../routes/bookRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

const prisma = new PrismaClient();

let token: string;
let userId: string;

beforeAll(async () => {
  // Clean up
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  // Create user and get token
  const res = await request(app).post("/api/auth/register").send({
    email: "booktest@example.com",
    username: "booktest",
    password: "password123",
    displayName: "Book Test User",
  });

  token = res.body.token;
  userId = res.body.user.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Book API", () => {
  let bookId: string;

  it("should create a new book", async () => {
    const res = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Book",
        author: "Test Author",
        totalPages: 100,
        status: "to-read",
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Test Book");
    expect(res.body.userId).toBe(userId);
    bookId = res.body.id;
  });

  it("should get all books", async () => {
    const res = await request(app)
      .get("/api/books")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.books)).toBe(true);
    expect(res.body.books.length).toBeGreaterThan(0);
  });

  it("should get a book by id", async () => {
    const res = await request(app)
      .get(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(bookId);
  });

  it("should update a book", async () => {
    const res = await request(app)
      .put(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "reading",
        currentPage: 50,
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("reading");
    expect(res.body.currentPage).toBe(50);
  });

  it("should delete a book", async () => {
    const res = await request(app)
      .delete(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Book deleted successfully");
  });
});
