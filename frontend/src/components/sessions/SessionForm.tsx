import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useBookStore } from "../../store/bookStore";
import type { CreateSessionInput } from "../../types/Session";

const sessionSchema = z.object({
  bookId: z.string().min(1, "Please select a book"),
  durationMinutes: z.number().min(1, "Duration must be at least 1 minute"),
  pagesRead: z.number().min(0, "Pages read cannot be negative"),
  notes: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
});

type SessionFormData = z.infer<typeof sessionSchema>;

interface SessionFormProps {
  onSubmit: (data: CreateSessionInput) => Promise<void>;
  isLoading?: boolean;
}

export const SessionForm: React.FC<SessionFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const { books } = useBookStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      startTime: new Date().toISOString().slice(0, 16),
      durationMinutes: 30,
      pagesRead: 0,
    },
  });

  const handleFormSubmit = async (data: SessionFormData) => {
    await onSubmit({
      ...data,
      notes: data.notes || undefined,
    });
  };

  // Filter books that are currently being read
  const readingBooks = books.filter((book) => book.status === "reading");

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Book *
        </label>
        <select
          {...register("bookId")}
          className="w-full px-4 py-2 bg-dark-700/50 border border-neon-cyan/20 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
        >
          <option value="">Select a book</option>
          {readingBooks.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title} - {book.author}
            </option>
          ))}
        </select>
        {errors.bookId && (
          <p className="text-red-400 text-sm mt-1">{errors.bookId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Start Time *
        </label>
        <input
          type="datetime-local"
          {...register("startTime")}
          className="w-full px-4 py-2 bg-dark-700/50 border border-neon-cyan/20 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
        />
        {errors.startTime && (
          <p className="text-red-400 text-sm mt-1">
            {errors.startTime.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Duration (minutes) *
          </label>
          <Input
            type="number"
            {...register("durationMinutes", { valueAsNumber: true })}
            placeholder="30"
          />
          {errors.durationMinutes && (
            <p className="text-red-400 text-sm mt-1">
              {errors.durationMinutes.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Pages Read *
          </label>
          <Input
            type="number"
            {...register("pagesRead", { valueAsNumber: true })}
            placeholder="10"
          />
          {errors.pagesRead && (
            <p className="text-red-400 text-sm mt-1">
              {errors.pagesRead.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Notes
        </label>
        <textarea
          {...register("notes")}
          rows={3}
          placeholder="Add any notes about this session..."
          className="w-full px-4 py-2 bg-dark-700/50 border border-neon-cyan/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="submit" isLoading={isLoading}>
          Log Session
        </Button>
      </div>
    </form>
  );
};
