import React from "react";
import { Modal } from "../ui/Modal";
import { BookForm } from "./BookForm";
import { useBookStore } from "../../store/bookStore";
import type { Book } from "../../types/Book";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book?: Book;
}

export const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  onClose,
  book,
}) => {
  const { createBook, updateBook, isLoading } = useBookStore();

  const handleSubmit = async (data: any) => {
    try {
      if (book) {
        await updateBook(book.id, data);
      } else {
        await createBook(data);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save book:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={book ? "Edit Book" : "Add New Book"}
      size="lg"
    >
      <BookForm
        onSubmit={handleSubmit}
        initialData={book}
        isLoading={isLoading}
      />
    </Modal>
  );
};
