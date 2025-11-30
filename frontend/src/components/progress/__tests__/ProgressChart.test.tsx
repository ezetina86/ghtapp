import { render, screen } from "@testing-library/react";
import { ProgressChart } from "../ProgressChart";
import { useProgressStore } from "../../../store/progressStore";
import { vi } from "vitest";

// Mock Recharts since it doesn't render well in JSDOM
vi.mock("recharts", () => {
  const OriginalModule = vi.importActual("recharts");
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => (
      <div className="recharts-responsive-container">{children}</div>
    ),
    LineChart: ({ children }: any) => (
      <div className="recharts-line-chart">{children}</div>
    ),
    Line: () => <div className="recharts-line" />,
    XAxis: () => <div className="recharts-xaxis" />,
    YAxis: () => <div className="recharts-yaxis" />,
    CartesianGrid: () => <div className="recharts-cartesian-grid" />,
    Tooltip: () => <div className="recharts-tooltip" />,
    Legend: () => <div className="recharts-legend" />,
  };
});

vi.mock("../../../store/progressStore", () => ({
  useProgressStore: vi.fn(),
}));

describe("ProgressChart", () => {
  const mockFetchProgressHistory = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state", () => {
    (useProgressStore as any).mockReturnValue({
      progressHistory: [],
      fetchProgressHistory: mockFetchProgressHistory,
      isLoading: true,
    });

    render(<ProgressChart bookId="123" />);
    expect(screen.getByText("Loading progress data...")).toBeInTheDocument();
  });

  it("should render empty state", () => {
    (useProgressStore as any).mockReturnValue({
      progressHistory: [],
      fetchProgressHistory: mockFetchProgressHistory,
      isLoading: false,
    });

    render(<ProgressChart bookId="123" />);
    expect(screen.getByText("No progress data available")).toBeInTheDocument();
  });

  it("should render chart when data is available", () => {
    (useProgressStore as any).mockReturnValue({
      progressHistory: [
        { date: "2023-01-01", pages: 10, minutes: 30 },
        { date: "2023-01-02", pages: 20, minutes: 60 },
      ],
      fetchProgressHistory: mockFetchProgressHistory,
      isLoading: false,
    });

    render(<ProgressChart bookId="123" />);
    expect(screen.getByText("Reading Progress")).toBeInTheDocument();
    // Since we mocked Recharts, we check for our mocked container class
    const chartContainer = document.querySelector(".recharts-line-chart");
    expect(chartContainer).toBeInTheDocument();
  });
});
