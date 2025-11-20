import React, { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../components/ui/Button";
import { BookList } from "../components/books/BookList";
import { BookModal } from "../components/books/BookModal";
import { useBookStore } from "../store/bookStore";

export const BooksPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fetchBooks } = useBookStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Books</h1>
          <p className="text-gray-400">Manage your reading collection</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Book</span>
        </Button>
      </div>

      {/* Book List */}
      <BookList />

      {/* Add/Edit Book Modal */}
      <BookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
