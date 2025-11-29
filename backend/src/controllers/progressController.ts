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

export const getBookProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { bookId } = req.params;

    if (!userId || !bookId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const book = await prisma.book.findFirst({
      where: { id: bookId as string, userId },
      include: {
        sessions: {
          orderBy: { startTime: "desc" as const },
          take: 10,
        },
      },
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const progressPercentage =
      book.totalPages > 0
        ? Math.round((book.currentPage / book.totalPages) * 100)
        : 0;

    const pagesRemaining = book.totalPages - book.currentPage;

    // Calculate recent reading pace (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSessions = await prisma.readingSession.findMany({
      where: {
        bookId: bookId as string,
        userId,
        startTime: { gte: sevenDaysAgo },
      },
    });

    const totalPagesRead = recentSessions.reduce(
      (sum, session) => sum + session.pagesRead,
      0,
    );

    const daysWithReading = new Set(
      recentSessions.map((s) => s.startTime.toISOString().split("T")[0]),
    ).size;

    const averagePagesPerDay =
      daysWithReading > 0 ? totalPagesRead / daysWithReading : 0;

    // Estimate completion date
    let estimatedCompletionDate = null;
    let daysToComplete = null;

    if (averagePagesPerDay > 0 && pagesRemaining > 0) {
      daysToComplete = Math.ceil(pagesRemaining / averagePagesPerDay);
      estimatedCompletionDate = new Date();
      estimatedCompletionDate.setDate(
        estimatedCompletionDate.getDate() + daysToComplete,
      );
    }

    res.json({
      bookId: book.id,
      title: book.title,
      currentPage: book.currentPage,
      totalPages: book.totalPages,
      progressPercentage,
      pagesRemaining,
      averagePagesPerDay: Math.round(averagePagesPerDay * 10) / 10,
      estimatedCompletionDate,
      daysToComplete,
      recentSessions: book.sessions,
    });
  } catch (error) {
    console.error("Get book progress error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getReadingPace = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sessions = await prisma.readingSession.findMany({
      where: {
        userId,
        startTime: { gte: thirtyDaysAgo },
      },
      orderBy: { startTime: "asc" },
    });

    if (sessions.length === 0) {
      return res.json({
        averagePagesPerDay: 0,
        averageMinutesPerDay: 0,
        totalPages: 0,
        totalMinutes: 0,
        daysActive: 0,
      });
    }

    const totalPages = sessions.reduce((sum, s) => sum + s.pagesRead, 0);
    const totalMinutes = sessions.reduce(
      (sum, s) => sum + s.durationMinutes,
      0,
    );

    const daysActive = new Set(
      sessions.map((s) => s.startTime.toISOString().split("T")[0]),
    ).size;

    const averagePagesPerDay = daysActive > 0 ? totalPages / daysActive : 0;
    const averageMinutesPerDay = daysActive > 0 ? totalMinutes / daysActive : 0;

    res.json({
      averagePagesPerDay: Math.round(averagePagesPerDay * 10) / 10,
      averageMinutesPerDay: Math.round(averageMinutesPerDay),
      totalPages,
      totalMinutes,
      daysActive,
    });
  } catch (error) {
    console.error("Get reading pace error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProgressHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { bookId } = req.query;
    const days = parseInt(req.query.days as string) || 30;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const whereClause: any = {
      userId,
      startTime: { gte: startDate },
    };

    if (bookId) {
      whereClause.bookId = bookId as string;
    }

    const sessions = await prisma.readingSession.findMany({
      where: whereClause,
      orderBy: { startTime: "asc" },
    });

    // Group by date
    const dailyProgress: Record<string, { pages: number; minutes: number }> =
      {};

    sessions.forEach((session) => {
      const date = session.startTime.toISOString().split("T")[0];
      if (date) {
        if (!dailyProgress[date]) {
          dailyProgress[date] = { pages: 0, minutes: 0 };
        }
        dailyProgress[date].pages += session.pagesRead;
        dailyProgress[date].minutes += session.durationMinutes;
      }
    });

    // Convert to array format for charts
    const history = Object.entries(dailyProgress).map(([date, data]) => ({
      date,
      pages: data.pages,
      minutes: data.minutes,
    }));

    res.json(history);
  } catch (error) {
    console.error("Get progress history error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
