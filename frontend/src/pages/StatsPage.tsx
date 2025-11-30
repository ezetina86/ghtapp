import React, { useEffect } from "react";
import { useStatsStore } from "../store/statsStore";
import { SessionDistributionChart } from "../components/stats/SessionDistributionChart";
import { TimeOfDayChart } from "../components/stats/TimeOfDayChart";
import { ReadingChart } from "../components/stats/ReadingChart";
import { StatsCard } from "../components/stats/StatsCard";
import {
  ClockIcon,
  BookOpenIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export const StatsPage: React.FC = () => {
  const {
    advancedStats,
    dailyHistory,
    sessionStats,
    bookStats,
    fetchAllStats,
    isLoading,
  } = useStatsStore();

  useEffect(() => {
    fetchAllStats();
  }, [fetchAllStats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading statistics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Analytics & Statistics
        </h1>
        <p className="text-gray-400">
          Deep dive into your reading habits and patterns
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Reading Time"
          value={`${sessionStats?.totalDuration || 0} min`}
          icon={ClockIcon}
          color="neon-cyan"
        />
        <StatsCard
          title="Books Completed"
          value={bookStats?.completedBooks || 0}
          icon={BookOpenIcon}
          color="neon-magenta"
        />
        <StatsCard
          title="Total Sessions"
          value={sessionStats?.totalSessions || 0}
          icon={ChartBarIcon}
          color="neon-lime"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Duration Distribution */}
        {advancedStats && (
          <SessionDistributionChart data={advancedStats.durationDistribution} />
        )}

        {/* Time of Day Analysis */}
        {advancedStats && (
          <TimeOfDayChart data={advancedStats.timeOfDayDistribution} />
        )}
      </div>

      {/* Daily Activity Trend */}
      {dailyHistory.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            30-Day Activity Trend
          </h3>
          <ReadingChart
            data={dailyHistory}
            type="area"
            dataKey="totalMinutes"
          />
        </div>
      )}
    </div>
  );
};
