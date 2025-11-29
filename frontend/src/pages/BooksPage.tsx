import React, { useEffect, useState, useMemo } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { BookCard3D } from "../components/books/BookCard3D";
import { BookModal } from "../components/books/BookModal";
import { ImportExportModal } from "../components/books/ImportExportModal";
import { useBookStore } from "../store/bookStore";

export const BooksPage: React.FC = () => {
  const { books, fetchBooks } = useBookStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const filteredBooks = useMemo(() => {
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [books, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Books</h1>
          <p className="text-gray-400">Manage your reading collection</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsImportExportOpen(true)}
            variant="secondary"
            className="flex items-center space-x-2"
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
            <span>Import/Export</span>
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Book</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search books by title or author..."
          className="pl-10 pr-4 py-2 w-full bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Book List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <BookCard3D key={book.id} book={book} />
        ))}
      </div>

      {/* Add/Edit Book Modal */}
      <BookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
      />
    </div>
  );
};
