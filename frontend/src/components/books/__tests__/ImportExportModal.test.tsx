import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ImportExportModal } from "../ImportExportModal";
import { useBookStore } from "../../../store/bookStore";
import { vi } from "vitest";

// Mock the store
vi.mock("../../../store/bookStore", () => ({
  useBookStore: vi.fn(),
}));

describe("ImportExportModal", () => {
  const mockExportBooks = vi.fn();
  const mockImportBooks = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useBookStore as any).mockReturnValue({
      exportBooks: mockExportBooks,
      importBooks: mockImportBooks,
      isLoading: false,
    });
  });

  it("should not render when isOpen is false", () => {
    render(<ImportExportModal isOpen={false} onClose={mockOnClose} />);
    expect(
      screen.queryByText("Import / Export Library"),
    ).not.toBeInTheDocument();
  });

  it("should render correctly when isOpen is true", () => {
    render(<ImportExportModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText("Import / Export Library")).toBeInTheDocument();
    expect(screen.getByText("Export")).toBeInTheDocument();
    expect(screen.getByText("Import")).toBeInTheDocument();
  });

  it("should switch between tabs", () => {
    render(<ImportExportModal isOpen={true} onClose={mockOnClose} />);

    // Default is export tab
    expect(screen.getByText("CSV Format")).toBeInTheDocument();

    // Switch to import tab
    fireEvent.click(screen.getByText("Import"));
    expect(screen.getByText("Click to select a file")).toBeInTheDocument();

    // Switch back to export tab
    fireEvent.click(screen.getByText("Export"));
    expect(screen.getByText("CSV Format")).toBeInTheDocument();
  });

  it("should call exportBooks when export button is clicked", async () => {
    render(<ImportExportModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText("CSV Format"));
    expect(mockExportBooks).toHaveBeenCalledWith("csv");

    fireEvent.click(screen.getByText("JSON Format"));
    expect(mockExportBooks).toHaveBeenCalledWith("json");
  });

  it("should handle file upload", async () => {
    render(<ImportExportModal isOpen={true} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText("Import"));

    const file = new File(["test content"], "test.json", {
      type: "application/json",
    });

    // The input is hidden and likely in a Portal, so we select it from document
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText("test.json")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Start Import"));

    await waitFor(() => {
      expect(mockImportBooks).toHaveBeenCalledWith(file);
    });
  });
});
