import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface ReadingChartProps {
  data: Array<{
    date: string;
    totalMinutes: number;
    totalPages: number;
    sessionCount: number;
  }>;
  type?: "line" | "bar";
  dataKey?: "totalMinutes" | "totalPages" | "sessionCount";
}

export const ReadingChart: React.FC<ReadingChartProps> = ({
  data,
  type = "line",
  dataKey = "totalMinutes",
}) => {
  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: format(new Date(item.date), "MMM dd"),
  }));

  const getLabel = () => {
    switch (dataKey) {
      case "totalMinutes":
        return "Minutes Read";
      case "totalPages":
        return "Pages Read";
      case "sessionCount":
        return "Sessions";
      default:
        return "Value";
    }
  };

  const ChartComponent = type === "line" ? LineChart : BarChart;
  const DataComponent = type === "line" ? Line : Bar;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50">
      <h3 className="text-lg font-bold text-white mb-4">Reading Activity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="formattedDate"
            stroke="#9CA3AF"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#fff",
            }}
            labelStyle={{ color: "#9CA3AF" }}
          />
          <DataComponent
            type="monotone"
            dataKey={dataKey}
            stroke="#06B6D4"
            fill="#06B6D4"
            strokeWidth={2}
            name={getLabel()}
          />
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};
