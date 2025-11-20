import React from "react";
import { motion } from "framer-motion";
import {
  ClockIcon,
  BookOpenIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Card } from "../ui/Card";
import { format } from "date-fns";
import type { ReadingSession } from "../../types/Session";

interface SessionCardProps {
  session: ReadingSession;
  bookTitle?: string;
  onDelete?: (id: string) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  bookTitle,
  onDelete,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="glass" className="relative group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <BookOpenIcon className="w-5 h-5 text-neon-cyan" />
              <h3 className="text-lg font-bold text-white">
                {bookTitle || "Unknown Book"}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Duration</p>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4 text-neon-magenta" />
                  <span className="text-white font-medium">
                    {session.durationMinutes} min
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Pages Read</p>
                <span className="text-white font-medium">
                  {session.pagesRead} pages
                </span>
              </div>

              <div className="col-span-2">
                <p className="text-xs text-gray-400 mb-1">Date</p>
                <span className="text-white text-sm">
                  {format(new Date(session.startTime), "PPp")}
                </span>
              </div>

              {session.notes && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 mb-1">Notes</p>
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {session.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Delete Button */}
          {onDelete && (
            <button
              onClick={() => onDelete(session.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-dark-700 hover:bg-red-600/20 rounded-lg text-red-400 hover:text-red-300"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
