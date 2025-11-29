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

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const { bookId, type } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!bookId) {
      return res.status(400).json({ error: "Book ID is required" });
    }

    const where: any = { userId, bookId: bookId as string };

    if (type) {
      where.noteType = type as string;
    }

    const notes = await prisma.note.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        book: {
          select: { title: true },
        },
      },
    });

    res.json(notes);
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { bookId, sessionId, content, pageNumber, noteType } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!bookId || !content) {
      return res
        .status(400)
        .json({ error: "Book ID and content are required" });
    }

    // Verify book belongs to user
    const book = await prisma.book.findFirst({
      where: { id: bookId, userId },
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const note = await prisma.note.create({
      data: {
        userId,
        bookId,
        sessionId,
        content,
        pageNumber: pageNumber ? parseInt(pageNumber) : null,
        noteType: noteType || "note",
      },
    });

    res.status(201).json(note);
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const existingNote = await prisma.note.findFirst({
      where: { id: id as string, userId },
    });

    if (!existingNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    const note = await prisma.note.update({
      where: { id: id as string },
      data: updates,
    });

    res.json(note);
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const existingNote = await prisma.note.findFirst({
      where: { id: id as string, userId },
    });

    if (!existingNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    await prisma.note.delete({
      where: { id: id as string },
    });

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
