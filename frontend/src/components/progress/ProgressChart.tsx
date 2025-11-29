import React, { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useProgressStore } from "../../store/progressStore";

interface ProgressChartProps {
  bookId?: string;
  days?: number;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  bookId,
  days = 30,
}) => {
  const { progressHistory, fetchProgressHistory, isLoading } =
    useProgressStore();

  useEffect(() => {
    fetchProgressHistory(bookId, days);
  }, [bookId, days, fetchProgressHistory]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading progress data...</div>
      </div>
    );
  }

  if (progressHistory.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">No progress data available</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">
        Reading Progress
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={progressHistory}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
          <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "0.5rem",
            }}
            labelStyle={{ color: "#F3F4F6" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="pages"
            stroke="#06b6d4"
            strokeWidth={2}
            name="Pages Read"
            dot={{ fill: "#06b6d4" }}
          />
          <Line
            type="monotone"
            dataKey="minutes"
            stroke="#a855f7"
            strokeWidth={2}
            name="Minutes"
            dot={{ fill: "#a855f7" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
