import { create } from "zustand";
import { api } from "../services/api";

interface DailyReading {
  date: string;
  totalMinutes: number;
  totalPages: number;
  sessionCount: number;
}

interface BookStats {
  totalBooks: number;
  readingBooks: number;
  completedBooks: number;
  toReadBooks: number;
  mostReadBooks: Array<{
    id: string;
    title: string;
    author: string;
    sessionCount: number;
    currentPage: number;
    totalPages: number;
  }>;
}

interface ReadingPace {
  averagePagesPerSession: number;
  averageMinutesPerSession: number;
  pagesPerMinute: string | number;
}

interface SessionStats {
  totalSessions: number;
  totalDuration: number;
  totalPages: number;
  currentStreak: number;
}

interface AdvancedStats {
  durationDistribution: {
    lessThan15: number;
    between15And30: number;
    between30And60: number;
    moreThan60: number;
  };
  timeOfDayDistribution: { hour: number; count: number }[];
  bookStatusDistribution: {
    toRead: number;
    reading: number;
    completed: number;
  };
}

interface StatsState {
  dailyHistory: DailyReading[];
  bookStats: BookStats | null;
  readingPace: ReadingPace | null;
  sessionStats: SessionStats | null;
  advancedStats: AdvancedStats | null;
  isLoading: boolean;
  error: string | null;
  fetchDailyHistory: (days?: number) => Promise<void>;
  fetchBookStats: () => Promise<void>;
  fetchReadingPace: () => Promise<void>;
  fetchSessionStats: () => Promise<void>;
  fetchAdvancedStats: () => Promise<void>;
  fetchAllStats: () => Promise<void>;
}

export const useStatsStore = create<StatsState>((set) => ({
  dailyHistory: [],
  bookStats: null,
  readingPace: null,
  sessionStats: null,
  advancedStats: null,
  isLoading: false,
  error: null,

  fetchDailyHistory: async (days = 30) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/stats/daily-history?days=${days}`);
      set({ dailyHistory: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchBookStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/stats/books");
      set({ bookStats: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchReadingPace: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/stats/reading-pace");
      set({ readingPace: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchSessionStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/sessions/stats");
      set({ sessionStats: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchAdvancedStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/stats/advanced");
      set({ advancedStats: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchAllStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const [
        dailyHistory,
        bookStats,
        readingPace,
        sessionStats,
        advancedStats,
      ] = await Promise.all([
        api.get("/stats/daily-history?days=30"),
        api.get("/stats/books"),
        api.get("/stats/reading-pace"),
        api.get("/sessions/stats"),
        api.get("/stats/advanced"),
      ]);
      set({
        dailyHistory: dailyHistory.data,
        bookStats: bookStats.data,
        readingPace: readingPace.data,
        sessionStats: sessionStats.data,
        advancedStats: advancedStats.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
