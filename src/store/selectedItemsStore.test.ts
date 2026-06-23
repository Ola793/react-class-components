import { beforeEach, describe, expect, it } from "vitest";
import type { Character } from "../types/character";
import { useSelectedItemsStore } from "./selectedItemsStore";

const rick: Character = {
  id: 1,
  name: "Rick Sanchez",
  status: "Alive",
  species: "Human",
  image: "https://example.com/rick.png",
};

describe("selectedItemsStore", () => {
  beforeEach(() => {
    useSelectedItemsStore.setState({ selectedItems: [] });
  });

  it("adds item to selected items", () => {
    useSelectedItemsStore.getState().toggleItem(rick);

    expect(useSelectedItemsStore.getState().selectedItems).toEqual([rick]);
  });

  it("removes item when it is already selected", () => {
    useSelectedItemsStore.setState({ selectedItems: [rick] });

    useSelectedItemsStore.getState().toggleItem(rick);

    expect(useSelectedItemsStore.getState().selectedItems).toEqual([]);
  });

  it("clears selected items", () => {
    useSelectedItemsStore.setState({ selectedItems: [rick] });

    useSelectedItemsStore.getState().clearItems();

    expect(useSelectedItemsStore.getState().selectedItems).toEqual([]);
  });
});
