import request from "supertest";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import authRoutes from "../routes/authRoutes.js";
import bookRoutes from "../routes/bookRoutes.js";
import noteRoutes from "../routes/noteRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/notes", noteRoutes);

const prisma = new PrismaClient();

let token: string;
let bookId: string;

beforeAll(async () => {
  // Clean up
  await prisma.note.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  // Create user
  const authRes = await request(app).post("/api/auth/register").send({
    email: "notetest@example.com",
    username: "notetest",
    password: "password123",
  });
  token = authRes.body.token;

  // Create book
  const bookRes = await request(app)
    .post("/api/books")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Note Test Book",
      author: "Note Author",
      totalPages: 300,
    });
  bookId = bookRes.body.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Note API", () => {
  let noteId: string;

  it("should create a note", async () => {
    const res = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bookId,
        content: "This is a great insight!",
        pageNumber: 42,
        noteType: "note",
      });

    expect(res.status).toBe(201);
    expect(res.body.content).toBe("This is a great insight!");
    expect(res.body.pageNumber).toBe(42);
    expect(res.body.noteType).toBe("note");
    noteId = res.body.id;
  });

  it("should create a highlight", async () => {
    const res = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bookId,
        content: "Important quote from the book",
        pageNumber: 100,
        noteType: "highlight",
      });

    expect(res.status).toBe(201);
    expect(res.body.noteType).toBe("highlight");
  });

  it("should get notes for a book", async () => {
    const res = await request(app)
      .get(`/api/notes?bookId=${bookId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].bookId).toBe(bookId);
  });

  it("should filter notes by type", async () => {
    const res = await request(app)
      .get(`/api/notes?bookId=${bookId}&type=highlight`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.every((note: any) => note.noteType === "highlight")).toBe(
      true,
    );
  });

  it("should update a note", async () => {
    const res = await request(app)
      .put(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "Updated insight!",
      });

    expect(res.status).toBe(200);
    expect(res.body.content).toBe("Updated insight!");
  });

  it("should delete a note", async () => {
    const res = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Note deleted successfully");
  });

  it("should return 404 for non-existent book", async () => {
    const res = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bookId: "non-existent-id",
        content: "Test note",
      });

    expect(res.status).toBe(404);
  });
});
