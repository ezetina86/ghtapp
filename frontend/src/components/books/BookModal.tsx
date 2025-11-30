import React from "react";
import { Modal } from "../ui/Modal";
import { BookForm } from "./BookForm";
import { useBookStore } from "../../store/bookStore";
import { useToast } from "../../hooks/useToast";
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
  const toast = useToast();

  const handleSubmit = async (data: any) => {
    try {
      if (book) {
        await updateBook(book.id, data);
        toast.success("Book updated successfully!");
      } else {
        await createBook(data);
        toast.success("Book added successfully!");
      }
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || error?.message || "Failed to save book";
      toast.error(errorMessage);
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
