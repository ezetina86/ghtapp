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
import { useGoalStore } from "../store/goalStore";
import { SessionTimer } from "../components/sessions/SessionTimer";
import { StatsCard } from "../components/stats/StatsCard";
import { ReadingChart } from "../components/stats/ReadingChart";
import { StreakDisplay } from "../components/stats/StreakDisplay";
import { GoalCard } from "../components/goals/GoalCard";
import { AnimatedProgress } from "../components/ui/AnimatedProgress";
import { AchievementBadge } from "../components/gamification/AchievementBadge";
import { ReadingPaceCard } from "../components/progress/ReadingPaceCard";
import { FireIcon, StarIcon } from "@heroicons/react/24/solid";

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { sessionStats, bookStats, dailyHistory, fetchAllStats, isLoading } =
    useStatsStore();
  const { goals, fetchGoals } = useGoalStore();

  useEffect(() => {
    fetchAllStats();
    fetchGoals(true); // Fetch active goals
  }, [fetchAllStats, fetchGoals]);

  const activeGoals = goals.slice(0, 2); // Show top 2 active goals

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

          {/* Reading Pace and Streak */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReadingPaceCard />
            <StreakDisplay currentStreak={sessionStats?.currentStreak || 0} />
          </div>

          {/* Reading Activity Chart */}
          {dailyHistory.length > 0 && (
            <ReadingChart
              data={dailyHistory}
              type="bar"
              dataKey="totalMinutes"
            />
          )}

          {/* Active Goals Preview */}
          {activeGoals.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Current Goals</h2>
                <Link
                  to="/goals"
                  className="text-sm text-neon-cyan hover:text-white"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            </div>
          )}

          {/* Achievements & Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-white mb-4">
                Recent Achievements
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <AchievementBadge
                  title="7 Day Streak"
                  description="Read for 7 days in a row"
                  icon={FireIcon}
                  isUnlocked={(sessionStats?.currentStreak || 0) >= 7}
                  color="text-orange-500"
                />
                <AchievementBadge
                  title="Bookworm"
                  description="Read 10 books"
                  icon={BookOpenIcon}
                  isUnlocked={(bookStats?.completedBooks || 0) >= 10}
                  color="text-neon-magenta"
                />
                <AchievementBadge
                  title="Early Bird"
                  description="Read before 8 AM"
                  icon={StarIcon}
                  isUnlocked={false}
                  color="text-yellow-400"
                />
              </div>
            </div>

            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center">
              <h3 className="text-lg font-bold text-white mb-6">
                Monthly Goal
              </h3>
              <AnimatedProgress
                percentage={75}
                label="Reading Goal"
                subLabel="300 / 400 pages"
                color="#06b6d4"
              />
            </div>
          </div>
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
