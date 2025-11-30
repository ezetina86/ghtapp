import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToastStore, useToast } from "../useToast";

describe("useToastStore", () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useToastStore.setState({ toasts: [] });
    });
  });

  it("initializes with empty toasts array", () => {
    const { result } = renderHook(() => useToastStore());
    expect(result.current.toasts).toEqual([]);
  });

  it("adds a toast to the store", () => {
    const { result } = renderHook(() => useToastStore());

    act(() => {
      result.current.addToast("Test message", "success");
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe("Test message");
    expect(result.current.toasts[0].type).toBe("success");
    expect(result.current.toasts[0].id).toBeDefined();
  });

  it("adds multiple toasts", () => {
    const { result } = renderHook(() => useToastStore());

    act(() => {
      result.current.addToast("First message", "success");
      result.current.addToast("Second message", "error");
    });

    expect(result.current.toasts).toHaveLength(2);
    expect(result.current.toasts[0].message).toBe("First message");
    expect(result.current.toasts[1].message).toBe("Second message");
  });

  it("removes a toast from the store", () => {
    const { result } = renderHook(() => useToastStore());

    act(() => {
      result.current.addToast("Test message", "success");
    });

    expect(result.current.toasts).toHaveLength(1);
    const toastId = result.current.toasts[0].id;

    act(() => {
      result.current.removeToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it("generates unique IDs for each toast", () => {
    const { result } = renderHook(() => useToastStore());

    act(() => {
      result.current.addToast("First", "success");
      result.current.addToast("Second", "error");
      result.current.addToast("Third", "info");
    });

    const ids = result.current.toasts.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(3);
  });
});

describe("useToast", () => {
  beforeEach(() => {
    act(() => {
      useToastStore.setState({ toasts: [] });
    });
  });

  it("provides success helper function", () => {
    const { result: toastResult } = renderHook(() => useToast());
    const { result: storeResult } = renderHook(() => useToastStore());

    act(() => {
      toastResult.current.success("Success message");
    });

    expect(storeResult.current.toasts).toHaveLength(1);
    expect(storeResult.current.toasts[0].message).toBe("Success message");
    expect(storeResult.current.toasts[0].type).toBe("success");
  });

  it("provides error helper function", () => {
    const { result: toastResult } = renderHook(() => useToast());
    const { result: storeResult } = renderHook(() => useToastStore());

    act(() => {
      toastResult.current.error("Error message");
    });

    expect(storeResult.current.toasts).toHaveLength(1);
    expect(storeResult.current.toasts[0].message).toBe("Error message");
    expect(storeResult.current.toasts[0].type).toBe("error");
  });

  it("provides info helper function", () => {
    const { result: toastResult } = renderHook(() => useToast());
    const { result: storeResult } = renderHook(() => useToastStore());

    act(() => {
      toastResult.current.info("Info message");
    });

    expect(storeResult.current.toasts).toHaveLength(1);
    expect(storeResult.current.toasts[0].message).toBe("Info message");
    expect(storeResult.current.toasts[0].type).toBe("info");
  });

  it("provides warning helper function", () => {
    const { result: toastResult } = renderHook(() => useToast());
    const { result: storeResult } = renderHook(() => useToastStore());

    act(() => {
      toastResult.current.warning("Warning message");
    });

    expect(storeResult.current.toasts).toHaveLength(1);
    expect(storeResult.current.toasts[0].message).toBe("Warning message");
    expect(storeResult.current.toasts[0].type).toBe("warning");
  });
});
