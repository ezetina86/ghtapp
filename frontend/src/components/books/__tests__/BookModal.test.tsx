import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookModal } from "../BookModal";

// Mock the child components and hooks
vi.mock("../../../store/bookStore", () => ({
  useBookStore: () => ({
    createBook: vi.fn().mockResolvedValue({ id: "1" }),
    updateBook: vi.fn().mockResolvedValue({ id: "1" }),
    isLoading: false,
  }),
}));

vi.mock("../../../hooks/useToast", () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }),
}));

vi.mock("../../ui/Modal", () => ({
  Modal: ({ children, isOpen, title }: any) =>
    isOpen ? (
      <div data-testid="modal">
        <h1>{title}</h1>
        {children}
      </div>
    ) : null,
}));

describe("BookModal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with 'Add New Book' title when no book prop", () => {
    render(<BookModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText("Add New Book")).toBeInTheDocument();
  });

  it("renders with 'Edit Book' title when book prop is provided", () => {
    const book = {
      id: "1",
      title: "Test Book",
      author: "Test Author",
      totalPages: 100,
      currentPage: 0,
      status: "to-read" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      dateAdded: new Date().toISOString(),
      userId: "user1",
    };

    render(<BookModal isOpen={true} onClose={mockOnClose} book={book} />);
    expect(screen.getByText("Edit Book")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(<BookModal isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("renders BookForm component", () => {
    render(<BookModal isOpen={true} onClose={mockOnClose} />);
    // Check that the form elements are rendered
    expect(screen.getByPlaceholderText(/book title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/author name/i)).toBeInTheDocument();
  });

  it("can fill out the form fields", async () => {
    const user = userEvent.setup();
    render(<BookModal isOpen={true} onClose={mockOnClose} />);

    const titleInput = screen.getByPlaceholderText(/book title/i);
    const authorInput = screen.getByPlaceholderText(/author name/i);

    await user.type(titleInput, "Test Book");
    await user.type(authorInput, "Test Author");

    expect(titleInput).toHaveValue("Test Book");
    expect(authorInput).toHaveValue("Test Author");
  });
});
