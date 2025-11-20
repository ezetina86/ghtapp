import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import type { CreateBookInput } from "../../types/Book";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().optional(),
  genre: z.string().optional(),
  totalPages: z.number().min(1, "Total pages must be at least 1").optional(),
  coverUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description: z.string().optional(),
  publisher: z.string().optional(),
  publicationYear: z
    .number()
    .min(1000, "Invalid year")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

interface BookFormProps {
  onSubmit: (data: CreateBookInput) => Promise<void>;
  initialData?: Partial<BookFormData>;
  isLoading?: boolean;
}

export const BookForm: React.FC<BookFormProps> = ({
  onSubmit,
  initialData,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = async (data: BookFormData) => {
    await onSubmit({
      ...data,
      coverUrl: data.coverUrl || undefined,
      totalPages: data.totalPages || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title *
          </label>
          <Input {...register("title")} placeholder="Book title" />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Author *
          </label>
          <Input {...register("author")} placeholder="Author name" />
          {errors.author && (
            <p className="text-red-400 text-sm mt-1">{errors.author.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            ISBN
          </label>
          <Input {...register("isbn")} placeholder="ISBN (optional)" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Genre
          </label>
          <Input {...register("genre")} placeholder="Genre (optional)" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Total Pages
          </label>
          <Input
            type="number"
            {...register("totalPages", { valueAsNumber: true })}
            placeholder="Total pages"
          />
          {errors.totalPages && (
            <p className="text-red-400 text-sm mt-1">
              {errors.totalPages.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Publisher
          </label>
          <Input
            {...register("publisher")}
            placeholder="Publisher (optional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Publication Year
          </label>
          <Input
            type="number"
            {...register("publicationYear", { valueAsNumber: true })}
            placeholder="Year (optional)"
          />
          {errors.publicationYear && (
            <p className="text-red-400 text-sm mt-1">
              {errors.publicationYear.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Cover URL
          </label>
          <Input
            {...register("coverUrl")}
            placeholder="Cover image URL (optional)"
          />
          {errors.coverUrl && (
            <p className="text-red-400 text-sm mt-1">
              {errors.coverUrl.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={3}
            placeholder="Book description (optional)"
            className="w-full px-4 py-2 bg-dark-700/50 border border-neon-cyan/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? "Update Book" : "Add Book"}
        </Button>
      </div>
    </form>
  );
};
