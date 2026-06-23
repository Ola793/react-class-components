import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Search } from "./Search";

describe("Search", () => {
  it("renders input and search button", () => {
    render(<Search initialValue="" onSearch={vi.fn()} />);

    expect(screen.getByPlaceholderText(/search characters by name/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("displays initial value in the input", () => {
    render(<Search initialValue="Morty" onSearch={vi.fn()} />);

    expect(screen.getByDisplayValue("Morty")).toBeInTheDocument();
  });

  it("updates input value when user types", async () => {
    const user = userEvent.setup();

    render(<Search initialValue="" onSearch={vi.fn()} />);

    const input = screen.getByPlaceholderText(/search characters by name/i);

    await user.type(input, "Rick");

    expect(screen.getByDisplayValue("Rick")).toBeInTheDocument();
  });

  it("calls onSearch with entered value when search button is clicked", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<Search initialValue="" onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText(/search characters by name/i), "Summer");

    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith("Summer");
  });

  it("calls onSearch when Enter is pressed", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<Search initialValue="" onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText(/search characters by name/i), "Beth{Enter}");

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith("Beth");
  });
});
