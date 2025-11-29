import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import type { Book } from "../../types/Book";

interface BookCard3DProps {
  book: Book;
}

export const BookCard3D: React.FC<BookCard3DProps> = ({ book }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reading":
        return "bg-neon-cyan text-black";
      case "completed":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-600 text-gray-300";
    }
  };

  const progress = Math.round((book.currentPage / book.totalPages) * 100);

  return (
    <div
      className="perspective-1000 w-full h-[400px] cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
          isHovered ? "rotate-y-180" : ""
        }`}
      >
        {/* Front of the card (Book Cover) */}
        <div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-gray-800">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-6 text-center">
              <BookOpenIcon className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-3">
                {book.title}
              </h3>
              <p className="text-gray-400">{book.author}</p>
            </div>
          )}

          {/* Status Badge */}
          <div
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${getStatusColor(book.status)}`}
          >
            {book.status.replace("-", " ")}
          </div>

          {/* Progress Bar (Bottom) */}
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-700">
            <div
              className="h-full bg-neon-cyan transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Back of the card (Details & Actions) */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-gray-800 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{book.title}</h3>
            <p className="text-neon-cyan mb-4">{book.author}</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neon-cyan"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{book.currentPage} pages read</span>
                <span>{book.totalPages} total</span>
              </div>
            </div>
          </div>

          <Link
            to={`/books/${book.id}`}
            className="w-full py-3 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 rounded-lg text-center font-medium transition-colors duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
