import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Card } from "./Card";
import type { Character } from "../types/character";
import userEvent from "@testing-library/user-event";

const character: Character = {
  id: 1,
  name: "Rick Sanchez",
  status: "Alive",
  species: "Human",
  image: "https://example.com/rick.png",
};

describe("Card", () => {
  it("renders character name, description and image", () => {
    render(<Card character={character} onSelect={vi.fn()} />);

    expect(screen.getByRole("heading", { name: /rick sanchez/i })).toBeInTheDocument();

    expect(screen.getByText(/alive/i)).toBeInTheDocument();
    expect(screen.getByText(/human/i)).toBeInTheDocument();

    expect(screen.getByRole("img", { name: /rick sanchez/i })).toHaveAttribute("src", character.image);
  });

  it("calls onSelect when card is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<Card character={character} onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: /rick sanchez/i }));

    expect(onSelect).toHaveBeenCalledWith(character.id);
  });

  it("calls onSelect when card is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<Card character={character} onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: /rick sanchez/i }));

    expect(onSelect).toHaveBeenCalledWith(character.id);
  });
});
