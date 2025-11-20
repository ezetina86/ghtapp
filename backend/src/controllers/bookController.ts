import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export const getBooks = async (req: AuthRequest, res: Response) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string } }, // SQLite doesn't support mode: 'insensitive' by default
        { author: { contains: search as string } },
      ];
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { dateAdded: "desc" },
      }),
      prisma.book.count({ where }),
    ]);

    res.json({
      books,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get books error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createBook = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      author,
      isbn,
      genre,
      totalPages,
      coverUrl,
      description,
      publisher,
      publicationYear,
    } = req.body;

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!title || !author) {
      return res.status(400).json({ error: "Title and author are required" });
    }

    const book = await prisma.book.create({
      data: {
        userId,
        title,
        author,
        isbn,
        genre,
        totalPages: totalPages || 0,
        coverUrl,
        description,
        publisher,
        publicationYear: publicationYear
          ? parseInt(publicationYear)
          : undefined,
      },
    });

    res.status(201).json(book);
  } catch (error) {
    console.error("Create book error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBookById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const book = await prisma.book.findFirst({
      where: { id, userId },
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("Get book error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBook = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if book belongs to user
    const existingBook = await prisma.book.findFirst({
      where: { id, userId },
    });

    if (!existingBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    const book = await prisma.book.update({
      where: { id },
      data: updates,
    });

    res.json(book);
  } catch (error) {
    console.error("Update book error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteBook = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const existingBook = await prisma.book.findFirst({
      where: { id, userId },
    });

    if (!existingBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    await prisma.book.delete({
      where: { id },
    });

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
