import { create } from "zustand";
import { sessionApi } from "../services/sessionApi";
import type {
  ReadingSession,
  CreateSessionInput,
  UpdateSessionInput,
} from "../types/Session";

interface SessionState {
  sessions: ReadingSession[];
  currentSession: ReadingSession | null;
  isLoading: boolean;
  error: string | null;
  fetchSessions: (params?: {
    bookId?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  fetchSessionById: (id: string) => Promise<void>;
  createSession: (data: CreateSessionInput) => Promise<ReadingSession>;
  updateSession: (
    id: string,
    data: UpdateSessionInput,
  ) => Promise<ReadingSession>;
  deleteSession: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null,

  fetchSessions: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const { sessions } = await sessionApi.getAll(params);
      set({ sessions, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch sessions",
        isLoading: false,
      });
    }
  },

  fetchSessionById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const session = await sessionApi.getById(id);
      set({ currentSession: session, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch session",
        isLoading: false,
      });
    }
  },

  createSession: async (data: CreateSessionInput) => {
    set({ isLoading: true, error: null });
    try {
      const session = await sessionApi.create(data);
      set((state) => ({
        sessions: [session, ...state.sessions],
        isLoading: false,
      }));
      return session;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to create session",
        isLoading: false,
      });
      throw error;
    }
  },

  updateSession: async (id: string, data: UpdateSessionInput) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSession = await sessionApi.update(id, data);
      set((state) => ({
        sessions: state.sessions.map((session) =>
          session.id === id ? updatedSession : session,
        ),
        currentSession:
          state.currentSession?.id === id
            ? updatedSession
            : state.currentSession,
        isLoading: false,
      }));
      return updatedSession;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to update session",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteSession: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await sessionApi.delete(id);
      set((state) => ({
        sessions: state.sessions.filter((session) => session.id !== id),
        currentSession:
          state.currentSession?.id === id ? null : state.currentSession,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to delete session",
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
