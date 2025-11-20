import React from "react";
import { motion } from "framer-motion";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Card } from "../ui/Card";
import type { Book } from "../../types/Book";

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (id: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onEdit,
  onDelete,
}) => {
  const progressPercentage =
    book.totalPages > 0 ? (book.currentPage / book.totalPages) * 100 : 0;

  const statusColors = {
    "to-read": "text-gray-400",
    reading: "text-neon-cyan",
    completed: "text-neon-lime",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="glass" hover className="relative group">
        {/* Book Cover */}
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <div className="w-24 h-32 bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 rounded-lg flex items-center justify-center border border-neon-cyan/30">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-4xl text-neon-cyan/50">📖</span>
              )}
            </div>
          </div>

          {/* Book Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate">
              {book.title}
            </h3>
            <p className="text-sm text-gray-400 truncate">{book.author}</p>
            {book.genre && (
              <p className="text-xs text-gray-500 mt-1">{book.genre}</p>
            )}

            {/* Status */}
            <span
              className={`inline-block mt-2 text-xs font-medium ${statusColors[book.status]}`}
            >
              {book.status.toUpperCase()}
            </span>

            {/* Progress Bar */}
            {book.status === "reading" && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>
                    {book.currentPage} / {book.totalPages} pages
                  </span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-neon-cyan to-neon-magenta h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(book)}
              className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-neon-cyan hover:text-white transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(book.id)}
              className="p-2 bg-dark-700 hover:bg-red-600/20 rounded-lg text-red-400 hover:text-red-300 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
