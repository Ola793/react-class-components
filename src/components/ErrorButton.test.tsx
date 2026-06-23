import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppErrorBoundary } from "./AppErrorBoundary";
import { ErrorButton } from "./ErrorButton";

describe("ErrorButton", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders simulate error button", () => {
    render(<ErrorButton />);

    expect(screen.getByRole("button", { name: /simulate error/i })).toBeInTheDocument();
  });

  it("triggers error boundary fallback after click", async () => {
    const user = userEvent.setup();

    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <AppErrorBoundary>
        <ErrorButton />
      </AppErrorBoundary>
    );

    await user.click(screen.getByRole("button", { name: /simulate error/i }));

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
