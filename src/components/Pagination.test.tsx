import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("renders current page and total pages", () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByText(/page 2 of 5/i)).toBeInTheDocument();
  });

  it("calls onPageChange with next page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with previous page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: /previous/i }));

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("disables previous button on the first page", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });

  it("disables next button on the last page", () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });
});
