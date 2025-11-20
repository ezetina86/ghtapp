import React, { useState } from "react";
import { BookCard } from "./BookCard";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { useBookStore } from "../../store/bookStore";

export const BookList: React.FC = () => {
  const { books, isLoading, error, deleteBook } = useBookStore();
  const [filter, setFilter] = useState("all");

  const filteredBooks =
    filter === "all" ? books : books.filter((book) => book.status === filter);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(id);
      } catch (error) {
        console.error("Failed to delete book:", error);
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

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex space-x-4 border-b border-dark-700">
        {[
          { value: "all", label: "All Books" },
          { value: "reading", label: "Reading" },
          { value: "to-read", label: "To Read" },
          { value: "completed", label: "Completed" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === tab.value
                ? "text-neon-cyan border-b-2 border-neon-cyan"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">
            {filter === "all"
              ? "No books yet. Add your first book to get started!"
              : `No ${filter} books found.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};
