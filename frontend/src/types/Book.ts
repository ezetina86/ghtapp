export interface Book {
  id: string;
  userId: string;
  title: string;
  author: string;
  isbn?: string;
  genre?: string;
  totalPages: number;
  coverUrl?: string;
  description?: string;
  publisher?: string;
  publicationYear?: number;
  status: BookStatus;
  currentPage: number;
  dateAdded: string;
  dateStarted?: string;
  dateCompleted?: string;
}

export type BookStatus = "to-read" | "reading" | "completed";

export interface CreateBookInput {
  title: string;
  author: string;
  isbn?: string;
  genre?: string;
  totalPages?: number;
  coverUrl?: string;
  description?: string;
  publisher?: string;
  publicationYear?: number;
}

export interface UpdateBookInput {
  title?: string;
  author?: string;
  isbn?: string;
  genre?: string;
  totalPages?: number;
  coverUrl?: string;
  description?: string;
  publisher?: string;
  publicationYear?: number;
  status?: BookStatus;
  currentPage?: number;
  dateStarted?: string;
  dateCompleted?: string;
}
