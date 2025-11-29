import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/Button";
import { api } from "../../services/api";
import type { CreateNoteData } from "../../types/note";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  onNoteAdded: () => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  bookId,
  onNoteAdded,
}) => {
  const [content, setContent] = useState("");
  const [pageNumber, setPageNumber] = useState("");
  const [noteType, setNoteType] = useState<"note" | "highlight" | "bookmark">(
    "note",
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const noteData: CreateNoteData = {
        bookId,
        content,
        pageNumber: pageNumber ? parseInt(pageNumber) : undefined,
        noteType,
      };

      await api.post("/notes", noteData);
      onNoteAdded();
      handleClose();
    } catch (error) {
      console.error("Failed to create note:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setContent("");
    setPageNumber("");
    setNoteType("note");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full rounded-lg bg-gray-800 p-6 shadow-xl border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-bold text-white">
              Add Note
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Type
              </label>
              <select
                value={noteType}
                onChange={(e) => setNoteType(e.target.value as any)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="note">Note</option>
                <option value="highlight">Highlight</option>
                <option value="bookmark">Bookmark</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Page Number (Optional)
              </label>
              <input
                type="number"
                value={pageNumber}
                onChange={(e) => setPageNumber(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 42"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your thoughts or highlight..."
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Note"}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
