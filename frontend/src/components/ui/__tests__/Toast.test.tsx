import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toast } from "../Toast";

describe("Toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders success toast with correct styling", () => {
    const onClose = vi.fn();
    render(
      <Toast message="Success message" type="success" onClose={onClose} />,
    );

    expect(screen.getByText("Success message")).toBeInTheDocument();
    const toast = screen.getByText("Success message").closest("div");
    expect(toast).toHaveClass("bg-green-500/90");
  });

  it("renders error toast with correct styling", () => {
    const onClose = vi.fn();
    render(<Toast message="Error message" type="error" onClose={onClose} />);

    expect(screen.getByText("Error message")).toBeInTheDocument();
    const toast = screen.getByText("Error message").closest("div");
    expect(toast).toHaveClass("bg-red-500/90");
  });

  it("renders info toast with correct styling", () => {
    const onClose = vi.fn();
    render(<Toast message="Info message" type="info" onClose={onClose} />);

    expect(screen.getByText("Info message")).toBeInTheDocument();
    const toast = screen.getByText("Info message").closest("div");
    expect(toast).toHaveClass("bg-blue-500/90");
  });

  it("renders warning toast with correct styling", () => {
    const onClose = vi.fn();
    render(
      <Toast message="Warning message" type="warning" onClose={onClose} />,
    );

    expect(screen.getByText("Warning message")).toBeInTheDocument();
    const toast = screen.getByText("Warning message").closest("div");
    expect(toast).toHaveClass("bg-yellow-500/90");
  });

  it("calls onClose when close button is clicked", async () => {
    vi.useRealTimers(); // Use real timers for this test
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Toast message="Test message" type="success" onClose={onClose} />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useFakeTimers(); // Switch back to fake timers
  });

  it("auto-dismisses after specified duration", async () => {
    const onClose = vi.fn();
    render(
      <Toast
        message="Test message"
        type="success"
        onClose={onClose}
        duration={3000}
      />,
    );

    expect(onClose).not.toHaveBeenCalled();

    // Run all timers and wait for any state updates
    await vi.runAllTimersAsync();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not auto-dismiss when duration is 0", async () => {
    const onClose = vi.fn();
    render(
      <Toast
        message="Test message"
        type="success"
        onClose={onClose}
        duration={0}
      />,
    );

    vi.advanceTimersByTime(10000);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("displays the correct icon for each toast type", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Toast message="Test" type="success" onClose={onClose} />,
    );
    expect(screen.getByText("Test").parentElement).toContainHTML("svg");

    rerender(<Toast message="Test" type="error" onClose={onClose} />);
    expect(screen.getByText("Test").parentElement).toContainHTML("svg");

    rerender(<Toast message="Test" type="info" onClose={onClose} />);
    expect(screen.getByText("Test").parentElement).toContainHTML("svg");

    rerender(<Toast message="Test" type="warning" onClose={onClose} />);
    expect(screen.getByText("Test").parentElement).toContainHTML("svg");
  });
});
