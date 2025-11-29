import { create } from "zustand";
import { api } from "../services/api";

interface BookProgress {
  bookId: string;
  title: string;
  currentPage: number;
  totalPages: number;
  progressPercentage: number;
  pagesRemaining: number;
  averagePagesPerDay: number;
  estimatedCompletionDate: string | null;
  daysToComplete: number | null;
}

interface ReadingPace {
  averagePagesPerDay: number;
  averageMinutesPerDay: number;
  totalPages: number;
  totalMinutes: number;
  daysActive: number;
}

interface ProgressHistoryItem {
  date: string;
  pages: number;
  minutes: number;
}

interface ProgressState {
  bookProgress: BookProgress | null;
  readingPace: ReadingPace | null;
  progressHistory: ProgressHistoryItem[];
  isLoading: boolean;
  error: string | null;
  fetchBookProgress: (bookId: string) => Promise<void>;
  fetchReadingPace: () => Promise<void>;
  fetchProgressHistory: (bookId?: string, days?: number) => Promise<void>;
  clearError: () => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  bookProgress: null,
  readingPace: null,
  progressHistory: [],
  isLoading: false,
  error: null,

  fetchBookProgress: async (bookId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/progress/book/${bookId}`);
      set({ bookProgress: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch book progress",
        isLoading: false,
      });
    }
  },

  fetchReadingPace: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/progress/pace");
      set({ readingPace: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch reading pace",
        isLoading: false,
      });
    }
  },

  fetchProgressHistory: async (bookId?: string, days: number = 30) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams({ days: days.toString() });
      if (bookId) {
        params.append("bookId", bookId);
      }
      const response = await api.get(`/progress/history?${params.toString()}`);
      set({ progressHistory: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error || "Failed to fetch progress history",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
