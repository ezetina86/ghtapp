import React from "react";
import { SessionCard } from "./SessionCard";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { useSessionStore } from "../../store/sessionStore";
import { useBookStore } from "../../store/bookStore";

export const SessionList: React.FC = () => {
  const { sessions, isLoading, error, deleteSession } = useSessionStore();
  const { books } = useBookStore();

  const getBookTitle = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    return book?.title;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await deleteSession(id);
      } catch (error) {
        console.error("Failed to delete session:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">
          No reading sessions yet. Log your first session to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          bookTitle={getBookTitle(session.bookId)}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};
