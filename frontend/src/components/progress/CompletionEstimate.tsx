import React, { useEffect } from "react";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useProgressStore } from "../../store/progressStore";

interface CompletionEstimateProps {
  bookId: string;
}

export const CompletionEstimate: React.FC<CompletionEstimateProps> = ({
  bookId,
}) => {
  const { bookProgress, fetchBookProgress, isLoading } = useProgressStore();

  useEffect(() => {
    fetchBookProgress(bookId);
  }, [bookId, fetchBookProgress]);

  if (isLoading || !bookProgress) {
    return null;
  }

  if (!bookProgress.estimatedCompletionDate || !bookProgress.daysToComplete) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-2">
          Completion Estimate
        </h3>
        <p className="text-gray-400 text-sm">
          Start reading to see your estimated completion date
        </p>
      </div>
    );
  }

  const completionDate = new Date(bookProgress.estimatedCompletionDate);
  const formattedDate = completionDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-gradient-to-br from-neon-cyan/10 to-neon-magenta/10 p-6 rounded-lg border border-neon-cyan/30">
      <h3 className="text-lg font-semibold text-white mb-4">
        Completion Estimate
      </h3>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="w-6 h-6 text-neon-cyan" />
          <div>
            <p className="text-sm text-gray-400">Estimated Completion</p>
            <p className="text-xl font-bold text-white">{formattedDate}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <ClockIcon className="w-6 h-6 text-neon-magenta" />
          <div>
            <p className="text-sm text-gray-400">Days Remaining</p>
            <p className="text-xl font-bold text-white">
              {bookProgress.daysToComplete} days
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            Based on your average pace of {bookProgress.averagePagesPerDay}{" "}
            pages/day
          </p>
        </div>
      </div>
    </div>
  );
};
