import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import {
  BookOpenIcon,
  ClockIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "../store/authStore";
import { useStatsStore } from "../store/statsStore";
import { SessionTimer } from "../components/sessions/SessionTimer";
import { StatsCard } from "../components/stats/StatsCard";
import { ReadingChart } from "../components/stats/ReadingChart";
import { StreakDisplay } from "../components/stats/StreakDisplay";

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { sessionStats, bookStats, dailyHistory, fetchAllStats, isLoading } =
    useStatsStore();

  useEffect(() => {
    fetchAllStats();
  }, [fetchAllStats]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.displayName || user?.username}!
        </h1>
        <p className="text-gray-400">
          Track your reading habits and monitor your progress
        </p>
      </div>

      {/* Session Timer */}
      <SessionTimer />

      {/* Stats Grid */}
      {isLoading ? (
        <div className="text-center text-gray-400 py-8">
          Loading statistics...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Sessions"
              value={sessionStats?.totalSessions || 0}
              icon={ClockIcon}
              color="neon-cyan"
            />
            <StatsCard
              title="Reading Time"
              value={`${sessionStats?.totalDuration || 0} min`}
              icon={ClockIcon}
              color="neon-magenta"
            />
            <StatsCard
              title="Pages Read"
              value={sessionStats?.totalPages || 0}
              icon={DocumentTextIcon}
              color="neon-lime"
            />
            <StatsCard
              title="Books Reading"
              value={bookStats?.readingBooks || 0}
              icon={BookOpenIcon}
              color="neon-cyan"
              subtitle={`${bookStats?.completedBooks || 0} completed`}
            />
          </div>

          {/* Streak Display */}
          <StreakDisplay currentStreak={sessionStats?.currentStreak || 0} />

          {/* Reading Activity Chart */}
          {dailyHistory.length > 0 && (
            <ReadingChart
              data={dailyHistory}
              type="bar"
              dataKey="totalMinutes"
            />
          )}
        </>
      )}

      {/* Quick Actions */}
      <Card variant="neon">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/books"
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 border border-neon-cyan/30 rounded-lg hover:shadow-lg hover:shadow-neon-cyan/30 transition-all duration-300"
          >
            <BookOpenIcon className="w-6 h-6 text-neon-cyan" />
            <span className="text-white font-medium">Manage Books</span>
          </Link>
          <Link
            to="/sessions"
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-neon-magenta/20 to-neon-lime/20 border border-neon-magenta/30 rounded-lg hover:shadow-lg hover:shadow-neon-magenta/30 transition-all duration-300"
          >
            <ClockIcon className="w-6 h-6 text-neon-magenta" />
            <span className="text-white font-medium">Log Session</span>
          </Link>
        </div>
      </Card>
    </div>
  );
};
