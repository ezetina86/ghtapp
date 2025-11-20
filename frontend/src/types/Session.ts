export interface ReadingSession {
  id: string;
  userId: string;
  bookId: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  pagesRead: number;
  notes?: string;
  createdAt: string;
}

export interface CreateSessionInput {
  bookId: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  pagesRead: number;
  notes?: string;
}

export interface UpdateSessionInput {
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  pagesRead?: number;
  notes?: string;
}
