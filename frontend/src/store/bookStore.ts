import { create } from "zustand";
import { bookApi } from "../services/bookApi";
import type { Book, CreateBookInput, UpdateBookInput } from "../types/Book";

interface BookState {
  books: Book[];
  currentBook: Book | null;
  isLoading: boolean;
  error: string | null;
  fetchBooks: (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  fetchBookById: (id: string) => Promise<void>;
  createBook: (data: CreateBookInput) => Promise<Book>;
  updateBook: (id: string, data: UpdateBookInput) => Promise<Book>;
  deleteBook: (id: string) => Promise<void>;
  updateProgress: (id: string, currentPage: number) => Promise<void>;
  clearError: () => void;
}

export const useBookStore = create<BookState>((set) => ({
  books: [],
  currentBook: null,
  isLoading: false,
  error: null,

  fetchBooks: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const { books } = await bookApi.getAll(params);
      set({ books, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch books",
        isLoading: false,
      });
    }
  },

  fetchBookById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const book = await bookApi.getById(id);
      set({ currentBook: book, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch book",
        isLoading: false,
      });
    }
  },

  createBook: async (data: CreateBookInput) => {
    set({ isLoading: true, error: null });
    try {
      const book = await bookApi.create(data);
      set((state) => ({
        books: [book, ...state.books],
        isLoading: false,
      }));
      return book;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to create book",
        isLoading: false,
      });
      throw error;
    }
  },

  updateBook: async (id: string, data: UpdateBookInput) => {
    set({ isLoading: true, error: null });
    try {
      const updatedBook = await bookApi.update(id, data);
      set((state) => ({
        books: state.books.map((book) => (book.id === id ? updatedBook : book)),
        currentBook:
          state.currentBook?.id === id ? updatedBook : state.currentBook,
        isLoading: false,
      }));
      return updatedBook;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to update book",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteBook: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await bookApi.delete(id);
      set((state) => ({
        books: state.books.filter((book) => book.id !== id),
        currentBook: state.currentBook?.id === id ? null : state.currentBook,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to delete book",
        isLoading: false,
      });
      throw error;
    }
  },

  updateProgress: async (id: string, currentPage: number) => {
    set({ isLoading: true, error: null });
    try {
      const updatedBook = await bookApi.updateProgress(id, currentPage);
      set((state) => ({
        books: state.books.map((book) => (book.id === id ? updatedBook : book)),
        currentBook:
          state.currentBook?.id === id ? updatedBook : state.currentBook,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to update progress",
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
