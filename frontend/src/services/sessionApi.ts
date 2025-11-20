import { api } from "./api";
import type {
  ReadingSession,
  CreateSessionInput,
  UpdateSessionInput,
} from "../types/Session";

export const sessionApi = {
  getAll: async (params?: {
    bookId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ sessions: ReadingSession[]; pagination: any }> => {
    const response = await api.get("/sessions", { params });
    return response.data;
  },

  getById: async (id: string): Promise<ReadingSession> => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },

  create: async (data: CreateSessionInput): Promise<ReadingSession> => {
    const response = await api.post("/sessions", data);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateSessionInput,
  ): Promise<ReadingSession> => {
    const response = await api.put(`/sessions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/sessions/${id}`);
  },
};
