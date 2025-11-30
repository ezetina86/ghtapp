import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ToastContainer } from "../ToastContainer";
import { useToastStore } from "../../../hooks/useToast";

describe("ToastContainer", () => {
  beforeEach(() => {
    act(() => {
      useToastStore.setState({ toasts: [] });
    });
  });

  it("renders no toasts when the store is empty", () => {
    const { container } = render(<ToastContainer />);
    expect(container.querySelector(".space-y-2")).toBeInTheDocument();
    expect(container.querySelector(".space-y-2")?.children).toHaveLength(0);
  });

  it("renders a single toast from the store", () => {
    act(() => {
      useToastStore.getState().addToast("Test toast", "success");
    });

    render(<ToastContainer />);
    expect(screen.getByText("Test toast")).toBeInTheDocument();
  });

  it("renders multiple toasts from the store", () => {
    act(() => {
      useToastStore.getState().addToast("First toast", "success");
      useToastStore.getState().addToast("Second toast", "error");
      useToastStore.getState().addToast("Third toast", "info");
    });

    render(<ToastContainer />);
    expect(screen.getByText("First toast")).toBeInTheDocument();
    expect(screen.getByText("Second toast")).toBeInTheDocument();
    expect(screen.getByText("Third toast")).toBeInTheDocument();
  });

  it("updates when toasts are added to the store", () => {
    const { rerender } = render(<ToastContainer />);
    expect(screen.queryByText("New toast")).not.toBeInTheDocument();

    act(() => {
      useToastStore.getState().addToast("New toast", "warning");
    });

    rerender(<ToastContainer />);
    expect(screen.getByText("New toast")).toBeInTheDocument();
  });

  it("updates when toasts are removed from the store", () => {
    let toastId: string;
    act(() => {
      useToastStore.getState().addToast("Removable toast", "success");
      toastId = useToastStore.getState().toasts[0].id;
    });

    const { rerender } = render(<ToastContainer />);
    expect(screen.getByText("Removable toast")).toBeInTheDocument();

    act(() => {
      useToastStore.getState().removeToast(toastId);
    });

    rerender(<ToastContainer />);
    expect(screen.queryByText("Removable toast")).not.toBeInTheDocument();
  });

  it("has correct positioning styles", () => {
    const { container } = render(<ToastContainer />);
    const toastContainer = container.firstChild as HTMLElement;

    expect(toastContainer).toHaveClass("fixed");
    expect(toastContainer).toHaveClass("top-4");
    expect(toastContainer).toHaveClass("right-4");
    expect(toastContainer).toHaveClass("z-50");
  });
});
