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

export const getSessions = async (req: AuthRequest, res: Response) => {
  try {
    const { bookId, page = 1, limit = 20 } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { userId };

    if (bookId) {
      where.bookId = bookId;
    }

    const [sessions, total] = await Promise.all([
      prisma.readingSession.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { startTime: "desc" },
        include: { book: { select: { title: true } } },
      }),
      prisma.readingSession.count({ where }),
    ]);

    res.json({
      sessions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createSession = async (req: AuthRequest, res: Response) => {
  try {
    const { bookId, startTime, endTime, durationMinutes, pagesRead, notes } =
      req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!bookId || !startTime) {
      return res
        .status(400)
        .json({ error: "Book ID and start time are required" });
    }

    // Verify book belongs to user
    const book = await prisma.book.findFirst({
      where: { id: bookId, userId },
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const session = await prisma.readingSession.create({
      data: {
        userId,
        bookId,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        durationMinutes: durationMinutes || 0,
        pagesRead: pagesRead || 0,
        notes,
      },
    });

    // Update book current page and status if needed
    if (pagesRead > 0) {
      await prisma.book.update({
        where: { id: bookId },
        data: {
          currentPage: { increment: pagesRead },
          status: "reading", // Automatically set to reading
          dateStarted: book.dateStarted || new Date(),
        },
      });
    }

    res.status(201).json(session);
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateSession = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const existingSession = await prisma.readingSession.findFirst({
      where: { id: id as string, userId },
    });

    if (!existingSession) {
      return res.status(404).json({ error: "Session not found" });
    }

    const session = await prisma.readingSession.update({
      where: { id: id as string },
      data: updates,
    });

    res.json(session);
  } catch (error) {
    console.error("Update session error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteSession = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const existingSession = await prisma.readingSession.findFirst({
      where: { id: id as string, userId },
    });

    if (!existingSession) {
      return res.status(404).json({ error: "Session not found" });
    }

    await prisma.readingSession.delete({
      where: { id: id as string },
    });

    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Delete session error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSessionStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [totalSessions, totalDuration, totalPages] = await Promise.all([
      prisma.readingSession.count({ where: { userId } }),
      prisma.readingSession.aggregate({
        where: { userId },
        _sum: { durationMinutes: true },
      }),
      prisma.readingSession.aggregate({
        where: { userId },
        _sum: { pagesRead: true },
      }),
    ]);

    // Calculate streaks (simplified version)
    // In a real app, this would be more complex and likely stored/cached
    const sessions = await prisma.readingSession.findMany({
      where: { userId },
      orderBy: { startTime: "desc" },
      select: { startTime: true },
    });

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if read today
    if (sessions.length > 0) {
      const lastSessionDate = new Date(sessions[0].startTime);
      lastSessionDate.setHours(0, 0, 0, 0);

      if (lastSessionDate.getTime() === today.getTime()) {
        currentStreak = 1;
      }
    }

    res.json({
      totalSessions,
      totalDuration: totalDuration?._sum?.durationMinutes || 0,
      totalPages: totalPages?._sum?.pagesRead || 0,
      currentStreak,
    });
  } catch (error) {
    console.error("Get session stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
