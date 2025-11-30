import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface SessionDistributionChartProps {
  data: {
    lessThan15: number;
    between15And30: number;
    between30And60: number;
    moreThan60: number;
  };
}

export const SessionDistributionChart: React.FC<
  SessionDistributionChartProps
> = ({ data }) => {
  const chartData = [
    { name: "< 15m", value: data.lessThan15, color: "#f472b6" }, // Pink
    { name: "15-30m", value: data.between15And30, color: "#a855f7" }, // Purple
    { name: "30-60m", value: data.between30And60, color: "#06b6d4" }, // Cyan
    { name: "> 60m", value: data.moreThan60, color: "#84cc16" }, // Lime
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">
        Session Duration
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
            <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "#F3F4F6" }}
              cursor={{ fill: "#374151", opacity: 0.4 }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
