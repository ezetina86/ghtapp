import { render, screen } from "@testing-library/react";
import { CompletionEstimate } from "../CompletionEstimate";
import { useProgressStore } from "../../../store/progressStore";
import { vi } from "vitest";

vi.mock("../../../store/progressStore", () => ({
  useProgressStore: vi.fn(),
}));

describe("CompletionEstimate", () => {
  const mockFetchBookProgress = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state or null when loading", () => {
    (useProgressStore as any).mockReturnValue({
      bookProgress: null,
      fetchBookProgress: mockFetchBookProgress,
      isLoading: true,
    });

    const { container } = render(<CompletionEstimate bookId="123" />);
    expect(container.firstChild).toBeNull();
  });

  it("should render empty state when no estimate available", () => {
    (useProgressStore as any).mockReturnValue({
      bookProgress: {
        estimatedCompletionDate: null,
        daysToComplete: null,
      },
      fetchBookProgress: mockFetchBookProgress,
      isLoading: false,
    });

    render(<CompletionEstimate bookId="123" />);
    expect(screen.getByText("Completion Estimate")).toBeInTheDocument();
    expect(screen.getByText(/Start reading to see/i)).toBeInTheDocument();
  });

  it("should render estimate when data is available", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);

    (useProgressStore as any).mockReturnValue({
      bookProgress: {
        estimatedCompletionDate: futureDate.toISOString(),
        daysToComplete: 5,
        averagePagesPerDay: 10,
      },
      fetchBookProgress: mockFetchBookProgress,
      isLoading: false,
    });

    render(<CompletionEstimate bookId="123" />);
    expect(screen.getByText("5 days")).toBeInTheDocument();
    expect(screen.getByText(/10 pages\/day/i)).toBeInTheDocument();
  });
});
