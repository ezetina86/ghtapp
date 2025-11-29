import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../components/ui/Button";
import { useBookStore } from "../store/bookStore";
import { api } from "../services/api";
import type { Note } from "../types/note";
import { NoteModal } from "../components/books/NoteModal";
import { ProgressChart } from "../components/progress/ProgressChart";
import { CompletionEstimate } from "../components/progress/CompletionEstimate";

export const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentBook, fetchBookById, isLoading } = useBookStore();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBookById(id);
      fetchNotes(id);
    }
  }, [id, fetchBookById]);

  const fetchNotes = async (bookId: string) => {
    try {
      const response = await api.get(`/notes?bookId=${bookId}`);
      setNotes(response.data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  const handleNoteAdded = () => {
    if (id) {
      fetchNotes(id);
    }
  };

  if (isLoading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  if (!currentBook) {
    return <div className="text-white text-center mt-10">Book not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="secondary" onClick={() => navigate("/books")}>
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold text-white">Book Details</h1>
      </div>

      {/* Book Info */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-6">
        {currentBook.coverUrl && (
          <img
            src={currentBook.coverUrl}
            alt={currentBook.title}
            className="w-32 h-48 object-cover rounded-md shadow-md"
          />
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">
            {currentBook.title}
          </h2>
          <p className="text-gray-400 text-lg mb-4">{currentBook.author}</p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <span className="text-gray-500 block">Status</span>
              <span className="capitalize">
                {currentBook.status.replace("-", " ")}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">Progress</span>
              <span>
                {currentBook.currentPage} / {currentBook.totalPages} pages
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">Genre</span>
              <span>{currentBook.genre || "-"}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Added</span>
              <span>
                {new Date(currentBook.dateAdded).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Tracking Section */}
      {id && currentBook.status === "reading" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CompletionEstimate bookId={id} />
          <ProgressChart bookId={id} days={14} />
        </div>
      )}

      {/* Notes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Notes & Highlights</h3>
          <Button
            onClick={() => setIsNoteModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Note</span>
          </Button>
        </div>

        {notes.length === 0 ? (
          <div className="text-gray-500 text-center py-8 bg-gray-800/50 rounded-lg">
            No notes yet. Start reading and add your thoughts!
          </div>
        ) : (
          <div className="grid gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      note.noteType === "highlight"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : note.noteType === "bookmark"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-blue-500/20 text-blue-500"
                    }`}
                  >
                    {note.noteType.toUpperCase()}
                  </span>
                  {note.pageNumber && (
                    <span className="text-gray-500 text-xs">
                      Page {note.pageNumber}
                    </span>
                  )}
                </div>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {note.content}
                </p>
                <div className="mt-2 text-gray-600 text-xs">
                  {new Date(note.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {id && (
        <NoteModal
          isOpen={isNoteModalOpen}
          onClose={() => setIsNoteModalOpen(false)}
          bookId={id}
          onNoteAdded={handleNoteAdded}
        />
      )}
    </div>
  );
};
