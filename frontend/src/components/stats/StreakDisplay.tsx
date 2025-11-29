import React from "react";
import { FireIcon } from "@heroicons/react/24/solid";

interface StreakDisplayProps {
  currentStreak: number;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  currentStreak,
}) => {
  return (
    <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 p-6 rounded-lg border border-orange-500/30">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-300 mb-1">Current Streak</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-orange-400">
              {currentStreak}
            </span>
            <span className="text-xl text-gray-400">
              {currentStreak === 1 ? "day" : "days"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {currentStreak > 0
              ? "Keep it up! 🔥"
              : "Start reading to build your streak!"}
          </p>
        </div>
        <FireIcon className="w-16 h-16 text-orange-500" />
      </div>
    </div>
  );
};
