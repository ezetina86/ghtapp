import request from "supertest";
import app from "../app.js";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

describe("Import/Export API", () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        username: `testuser-${Date.now()}`,
        password: "password123",
      },
    });
    userId = user.id;
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "test-secret");
  });

  afterAll(async () => {
    await prisma.readingSession.deleteMany({ where: { userId } });
    await prisma.book.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  describe("POST /api/data/import", () => {
    it("should import books from a valid JSON file", async () => {
      const books = [
        {
          title: "Test Book 1",
          author: "Author 1",
          status: "to-read",
          totalPages: 100,
        },
        {
          title: "Test Book 2",
          author: "Author 2",
          status: "reading",
          totalPages: 200,
        },
      ];

      const filePath = path.join(__dirname, "test-books.json");
      fs.writeFileSync(filePath, JSON.stringify(books));

      const response = await request(app)
        .post("/api/data/import")
        .set("Authorization", `Bearer ${token}`)
        .attach("file", filePath);

      fs.unlinkSync(filePath);

      expect(response.status).toBe(200);
      expect(response.body.imported).toBe(2);
      expect(response.body.errors).toBe(0);

      const dbBooks = await prisma.book.findMany({ where: { userId } });
      expect(dbBooks).toHaveLength(2);
    });

    it("should import books from a valid CSV file", async () => {
      const csvContent = `title,author,totalPages,status
CSV Book 1,CSV Author 1,150,to-read
CSV Book 2,CSV Author 2,250,completed`;

      const filePath = path.join(__dirname, "test-books.csv");
      fs.writeFileSync(filePath, csvContent);

      const response = await request(app)
        .post("/api/data/import")
        .set("Authorization", `Bearer ${token}`)
        .attach("file", filePath);

      fs.unlinkSync(filePath);

      expect(response.status).toBe(200);
      expect(response.body.imported).toBe(2);

      const dbBooks = await prisma.book.findMany({
        where: { userId, title: { startsWith: "CSV Book" } },
      });
      expect(dbBooks).toHaveLength(2);
    });

    it("should reject invalid file formats", async () => {
      const filePath = path.join(__dirname, "test.txt");
      fs.writeFileSync(filePath, "invalid content");

      const response = await request(app)
        .post("/api/data/import")
        .set("Authorization", `Bearer ${token}`)
        .attach("file", filePath);

      fs.unlinkSync(filePath);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Invalid file format");
    });
  });

  describe("GET /api/data/export", () => {
    beforeEach(async () => {
      // Ensure books exist for export
      await prisma.book.create({
        data: {
          userId,
          title: "Export Test Book",
          author: "Export Author",
          totalPages: 300,
          status: "reading",
        },
      });
    });

    it("should export books as JSON", async () => {
      const response = await request(app)
        .get("/api/data/export?format=json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.header["content-type"]).toBe(
        "application/json; charset=utf-8",
      );
      expect(response.header["content-disposition"]).toContain(
        "books_export.json",
      );

      const books = JSON.parse(response.text);
      expect(Array.isArray(books)).toBe(true);
      expect(books.length).toBeGreaterThan(0);
      expect(books[0]).toHaveProperty("title");
    });

    it("should export books as CSV", async () => {
      const response = await request(app)
        .get("/api/data/export?format=csv")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.header["content-type"]).toBe("text/csv; charset=utf-8");
      expect(response.header["content-disposition"]).toContain(
        "books_export.csv",
      );

      expect(response.text).toContain("title");
      expect(response.text).toContain("author");
      expect(response.text).toContain("Export Test Book");
    });
  });
});
