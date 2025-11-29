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

// Helper function to calculate goal progress
const calculateGoalProgress = async (goal: any, userId: string) => {
  const now = new Date();
  const startDate = new Date(goal.startDate);
  const endDate = goal.endDate ? new Date(goal.endDate) : null;

  // Determine the date range for progress calculation
  let queryStartDate = startDate;

  switch (goal.goalType) {
    case "daily":
      queryStartDate = new Date(now);
      queryStartDate.setHours(0, 0, 0, 0);
      break;
    case "weekly":
      queryStartDate = new Date(now);
      queryStartDate.setDate(now.getDate() - now.getDay()); // Start of week
      queryStartDate.setHours(0, 0, 0, 0);
      break;
    case "monthly":
      queryStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "yearly":
      queryStartDate = new Date(now.getFullYear(), 0, 1);
      break;
  }

  // Fetch sessions within the goal period
  const sessions = await prisma.readingSession.findMany({
    where: {
      userId,
      startTime: {
        gte: queryStartDate,
        ...(endDate && { lte: endDate }),
      },
    },
  });

  // Calculate progress based on target unit
  let currentProgress = 0;
  switch (goal.targetUnit) {
    case "minutes":
      currentProgress = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
      break;
    case "pages":
      currentProgress = sessions.reduce((sum, s) => sum + s.pagesRead, 0);
      break;
    case "books":
      // Count unique books that were completed during this period
      const completedBooks = await prisma.book.count({
        where: {
          userId,
          status: "completed",
          dateCompleted: {
            gte: queryStartDate,
            ...(endDate && { lte: endDate }),
          },
        },
      });
      currentProgress = completedBooks;
      break;
  }

  return currentProgress;
};

export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { active } = req.query;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const where: any = { userId };
    if (active !== undefined) {
      where.isActive = active === "true";
    }

    const goals = await prisma.goal.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Calculate current progress for each goal
    const goalsWithProgress = await Promise.all(
      goals.map(async (goal) => {
        const currentProgress = await calculateGoalProgress(goal, userId);
        const progressPercentage = Math.min(
          Math.round((currentProgress / goal.targetValue) * 100),
          100,
        );

        return {
          ...goal,
          currentProgress,
          progressPercentage,
          isCompleted: currentProgress >= goal.targetValue,
        };
      }),
    );

    res.json(goalsWithProgress);
  } catch (error) {
    console.error("Get goals error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      goalType,
      targetValue,
      targetUnit,
      startDate,
      endDate,
    } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!title || !goalType || !targetValue || !targetUnit || !startDate) {
      return res.status(400).json({
        error:
          "Title, goal type, target value, target unit, and start date are required",
      });
    }

    const goal = await prisma.goal.create({
      data: {
        userId,
        title,
        description,
        goalType,
        targetValue: parseInt(targetValue),
        targetUnit,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        currentProgress: 0,
      },
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error("Create goal error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const existingGoal = await prisma.goal.findFirst({
      where: { id: id as string, userId },
    });

    if (!existingGoal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    const goal = await prisma.goal.update({
      where: { id: id as string },
      data: updates,
    });

    res.json(goal);
  } catch (error) {
    console.error("Update goal error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const existingGoal = await prisma.goal.findFirst({
      where: { id: id as string, userId },
    });

    if (!existingGoal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    await prisma.goal.delete({
      where: { id: id as string },
    });

    res.json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Delete goal error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGoalProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const goal = await prisma.goal.findFirst({
      where: { id: id as string, userId },
    });

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    const currentProgress = await calculateGoalProgress(goal, userId);
    const progressPercentage = Math.min(
      Math.round((currentProgress / goal.targetValue) * 100),
      100,
    );

    res.json({
      ...goal,
      currentProgress,
      progressPercentage,
      isCompleted: currentProgress >= goal.targetValue,
      remaining: Math.max(goal.targetValue - currentProgress, 0),
    });
  } catch (error) {
    console.error("Get goal progress error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
