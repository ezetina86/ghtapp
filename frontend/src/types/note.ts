export interface Note {
  id: string;
  userId: string;
  bookId: string;
  sessionId?: string;
  content: string;
  pageNumber?: number;
  noteType: "note" | "highlight" | "bookmark";
  createdAt: string;
}

export interface CreateNoteData {
  bookId: string;
  content: string;
  pageNumber?: number;
  noteType?: "note" | "highlight" | "bookmark";
  sessionId?: string;
}

export interface UpdateNoteData {
  content?: string;
  pageNumber?: number;
  noteType?: "note" | "highlight" | "bookmark";
}
