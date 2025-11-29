import React, { useEffect } from "react";
import {
  BookOpenIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useProgressStore } from "../../store/progressStore";

export const ReadingPaceCard: React.FC = () => {
  const { readingPace, fetchReadingPace, isLoading } = useProgressStore();

  useEffect(() => {
    fetchReadingPace();
  }, [fetchReadingPace]);

  if (isLoading || !readingPace) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Reading Pace</h3>
        <ChartBarIcon className="w-6 h-6 text-neon-cyan" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <BookOpenIcon className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-400">Pages/Day</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {readingPace.averagePagesPerDay.toFixed(1)}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-400">Minutes/Day</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {readingPace.averageMinutesPerDay}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Last 30 days</span>
          <span className="text-neon-cyan font-medium">
            {readingPace.daysActive} active days
          </span>
        </div>
      </div>
    </div>
  );
};
