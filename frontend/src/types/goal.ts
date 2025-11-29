export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  goalType: "daily" | "weekly" | "monthly" | "yearly";
  targetValue: number;
  targetUnit: "minutes" | "pages" | "books";
  currentProgress: number;
  progressPercentage?: number;
  isCompleted?: boolean;
  remaining?: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateGoalData {
  title: string;
  description?: string;
  goalType: "daily" | "weekly" | "monthly" | "yearly";
  targetValue: number;
  targetUnit: "minutes" | "pages" | "books";
  startDate: string;
  endDate?: string;
}

export interface UpdateGoalData {
  title?: string;
  description?: string;
  targetValue?: number;
  isActive?: boolean;
  endDate?: string;
}
