import { api } from "./api";
import type { Book, CreateBookInput, UpdateBookInput } from "../types/Book";

export const bookApi = {
  getAll: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ books: Book[]; pagination: any }> => {
    const response = await api.get("/books", { params });
    return response.data;
  },

  getById: async (id: string): Promise<Book> => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  create: async (data: CreateBookInput): Promise<Book> => {
    const response = await api.post("/books", data);
    return response.data;
  },

  update: async (id: string, data: UpdateBookInput): Promise<Book> => {
    const response = await api.put(`/books/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/books/${id}`);
  },

  updateProgress: async (id: string, currentPage: number): Promise<Book> => {
    const response = await api.patch(`/books/${id}/progress`, { currentPage });
    return response.data;
  },
};
