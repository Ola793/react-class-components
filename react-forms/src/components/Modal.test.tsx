import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders modal content through portal", () => {
    render(
      <Modal title="Test modal" onClose={vi.fn()}>
        <button type="button">Focusable child</button>
      </Modal>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /test modal/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /focusable child/i })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal title="Test modal" onClose={onClose}>
        <button type="button">Focusable child</button>
      </Modal>
    );

    await user.click(screen.getByRole("button", { name: /close/i }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal title="Test modal" onClose={onClose}>
        <button type="button">Focusable child</button>
      </Modal>
    );

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when overlay is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal title="Test modal" onClose={onClose}>
        <button type="button">Focusable child</button>
      </Modal>
    );

    await user.click(screen.getByRole("dialog").parentElement as HTMLElement);

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not close when dialog content is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal title="Test modal" onClose={onClose}>
        <button type="button">Focusable child</button>
      </Modal>
    );

    await user.click(screen.getByRole("dialog"));

    expect(onClose).not.toHaveBeenCalled();
  });
});
