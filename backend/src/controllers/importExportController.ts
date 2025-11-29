import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse/sync";
import { Parser } from "json2csv";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
  file?: Express.Multer.File | undefined;
}

export const exportBooks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const format = req.query.format as string;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const books = await prisma.book.findMany({
      where: { userId },
      select: {
        title: true,
        author: true,
        totalPages: true,
        currentPage: true,
        status: true,
        dateStarted: true,
        dateCompleted: true,
      },
    });

    if (format === "csv") {
      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(books);
      res.header("Content-Type", "text/csv");
      res.attachment("books_export.csv");
      return res.send(csv);
    } else {
      res.header("Content-Type", "application/json");
      res.attachment("books_export.json");
      return res.send(JSON.stringify(books, null, 2));
    }
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const importBooks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const file = req.file;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let booksToImport: any[] = [];

    if (file.mimetype === "application/json") {
      booksToImport = JSON.parse(file.buffer.toString());
    } else if (file.mimetype === "text/csv") {
      booksToImport = parse(file.buffer.toString(), {
        columns: true,
        skip_empty_lines: true,
      });
    } else {
      return res
        .status(400)
        .json({ error: "Invalid file format. Use JSON or CSV." });
    }

    if (!Array.isArray(booksToImport)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    let importedCount = 0;
    let errorCount = 0;

    for (const bookData of booksToImport) {
      try {
        // Basic validation
        if (!bookData.title || !bookData.author) {
          errorCount++;
          continue;
        }

        // Check for duplicates (optional, based on title/author)
        const existingBook = await prisma.book.findFirst({
          where: {
            userId,
            title: bookData.title,
            author: bookData.author,
          },
        });

        if (existingBook) {
          // Skip or update? For now, skip duplicates
          continue;
        }

        await prisma.book.create({
          data: {
            userId,
            title: bookData.title,
            author: bookData.author,
            totalPages: Number(bookData.totalPages) || 0,
            currentPage: Number(bookData.currentPage) || 0,
            status: bookData.status || "to-read",
            dateStarted: bookData.dateStarted
              ? new Date(bookData.dateStarted)
              : null,
            dateCompleted: bookData.dateCompleted
              ? new Date(bookData.dateCompleted)
              : null,
          },
        });
        importedCount++;
      } catch (err) {
        console.error("Error importing book:", err);
        errorCount++;
      }
    }

    res.json({
      message: "Import completed",
      imported: importedCount,
      errors: errorCount,
    });
  } catch (error) {
    console.error("Import error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
