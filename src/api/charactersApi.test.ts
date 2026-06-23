import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCharacters } from "./charactersApi";

const characterResponse = {
  info: {
    count: 1,
    pages: 1,
    next: null,
    prev: null,
  },
  results: [
    {
      id: 1,
      name: "Rick Sanchez",
      status: "Alive",
      species: "Human",
      image: "https://example.com/rick.png",
    },
  ],
};

describe("fetchCharacters", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches the first page of all characters when search term is empty", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => characterResponse,
    } as Response);

    const characters = await fetchCharacters("");

    expect(fetchMock).toHaveBeenCalledWith("https://rickandmortyapi.com/api/character?page=1");
    expect(characters).toEqual(characterResponse);
  });

  it("fetches the first page with search term when search term is provided", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => characterResponse,
    } as Response);

    const characters = await fetchCharacters("Rick");

    expect(fetchMock).toHaveBeenCalledWith("https://rickandmortyapi.com/api/character?page=1&name=Rick");
    expect(characters).toEqual(characterResponse);
  });

  it("throws a readable error when response is not successful", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
    } as Response);

    await expect(fetchCharacters("Unknown")).rejects.toThrow(
      "Unable to load characters. Please try another search term."
    );
  });
});
