import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import {
  BookOpenIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "../store/authStore";

import { SessionTimer } from "../components/sessions/SessionTimer";

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  const stats = [
    {
      title: "Books Reading",
      value: "0",
      icon: BookOpenIcon,
      color: "neon-cyan",
    },
    {
      title: "Reading Time",
      value: "0 min",
      icon: ClockIcon,
      color: "neon-magenta",
    },
    {
      title: "Books Completed",
      value: "0",
      icon: ChartBarIcon,
      color: "neon-lime",
    },
  ];

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} variant="glass" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <stat.icon className={`w-12 h-12 text-${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

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

      {/* Recent Activity */}
      <Card variant="glass">
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-gray-400">
          <p>No recent activity yet. Start tracking your reading!</p>
        </div>
      </Card>
    </div>
  );
};
