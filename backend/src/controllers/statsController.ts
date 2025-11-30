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

export const getDailyReadingHistory = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    const { days = 30 } = req.query;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number(days));

    const sessions = await prisma.readingSession.findMany({
      where: {
        userId,
        startTime: {
          gte: daysAgo,
        },
      },
      orderBy: { startTime: "asc" },
      select: {
        startTime: true,
        durationMinutes: true,
        pagesRead: true,
      },
    });

    // Group sessions by day
    const dailyStats: Record<string, any> = sessions.reduce(
      (acc: Record<string, any>, session) => {
        const date: string =
          new Date(session.startTime).toISOString().split("T")[0] || "";
        if (date && !acc[date]) {
          acc[date] = {
            date,
            totalMinutes: 0,
            totalPages: 0,
            sessionCount: 0,
          };
        }
        if (date) {
          acc[date].totalMinutes += session.durationMinutes;
          acc[date].totalPages += session.pagesRead;
          acc[date].sessionCount += 1;
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    const result = Object.values(dailyStats);

    res.json(result);
  } catch (error) {
    console.error("Get daily reading history error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBookStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [totalBooks, readingBooks, completedBooks, toReadBooks] =
      await Promise.all([
        prisma.book.count({ where: { userId } }),
        prisma.book.count({ where: { userId, status: "reading" } }),
        prisma.book.count({ where: { userId, status: "completed" } }),
        prisma.book.count({ where: { userId, status: "to-read" } }),
      ]);

    // Get most read books (by session count)
    const mostReadBooks = await prisma.book.findMany({
      where: { userId },
      include: {
        sessions: {
          select: { id: true },
        },
      },
      take: 5,
    });

    const booksWithSessionCount = mostReadBooks
      .map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        sessionCount: book.sessions.length,
        currentPage: book.currentPage,
        totalPages: book.totalPages,
      }))
      .sort((a, b) => b.sessionCount - a.sessionCount);

    res.json({
      totalBooks,
      readingBooks,
      completedBooks,
      toReadBooks,
      mostReadBooks: booksWithSessionCount,
    });
  } catch (error) {
    console.error("Get book stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getReadingPace = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const sessions = await prisma.readingSession.findMany({
      where: { userId },
      select: {
        durationMinutes: true,
        pagesRead: true,
      },
    });

    if (sessions.length === 0) {
      return res.json({
        averagePagesPerSession: 0,
        averageMinutesPerSession: 0,
        pagesPerMinute: 0,
      });
    }

    const totalPages = sessions.reduce((sum, s) => sum + s.pagesRead, 0);
    const totalMinutes = sessions.reduce(
      (sum, s) => sum + s.durationMinutes,
      0,
    );

    res.json({
      averagePagesPerSession: Math.round(totalPages / sessions.length),
      averageMinutesPerSession: Math.round(totalMinutes / sessions.length),
      pagesPerMinute:
        totalMinutes > 0 ? (totalPages / totalMinutes).toFixed(2) : 0,
    });
  } catch (error) {
    console.error("Get reading pace error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getAdvancedStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const sessions = await prisma.readingSession.findMany({
      where: { userId },
      select: {
        startTime: true,
        durationMinutes: true,
      },
    });

    // Session Duration Distribution
    const durationDistribution = {
      lessThan15: 0,
      between15And30: 0,
      between30And60: 0,
      moreThan60: 0,
    };

    // Time of Day Analysis (0-23)
    const timeOfDayDistribution = new Array(24).fill(0);

    sessions.forEach((session) => {
      // Duration
      if (session.durationMinutes < 15) durationDistribution.lessThan15++;
      else if (session.durationMinutes < 30)
        durationDistribution.between15And30++;
      else if (session.durationMinutes < 60)
        durationDistribution.between30And60++;
      else durationDistribution.moreThan60++;

      // Time of Day
      const hour = new Date(session.startTime).getHours();
      timeOfDayDistribution[hour]++;
    });

    // Book Status Distribution
    const [toRead, reading, completed] = await Promise.all([
      prisma.book.count({ where: { userId, status: "to-read" } }),
      prisma.book.count({ where: { userId, status: "reading" } }),
      prisma.book.count({ where: { userId, status: "completed" } }),
    ]);

    res.json({
      durationDistribution,
      timeOfDayDistribution: timeOfDayDistribution.map((count, hour) => ({
        hour,
        count,
      })),
      bookStatusDistribution: {
        toRead,
        reading,
        completed,
      },
    });
  } catch (error) {
    console.error("Get advanced stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
