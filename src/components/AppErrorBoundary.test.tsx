import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppErrorBoundary } from "./AppErrorBoundary";

const ThrowError = () => {
  throw new Error("Test render error");
};

describe("AppErrorBoundary", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders children when there is no error", () => {
    render(
      <AppErrorBoundary>
        <p>Child content</p>
      </AppErrorBoundary>
    );

    expect(screen.getByText(/child content/i)).toBeInTheDocument();
  });

  it("displays fallback UI when child component throws an error", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <AppErrorBoundary>
        <ThrowError />
      </AppErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/please reload the page/i)).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
