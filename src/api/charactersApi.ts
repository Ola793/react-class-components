import type { Character, CharactersResponse } from "../types/character";

const BASE_URL = "https://rickandmortyapi.com/api/character";

export const fetchCharacters = async (searchTerm: string, page = 1): Promise<CharactersResponse> => {
  const params = new URLSearchParams();

  params.set("page", String(page));

  if (searchTerm) {
    params.set("name", searchTerm);
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Unable to load characters. Please try another search term.");
  }

  return response.json() as Promise<CharactersResponse>;
};

export const fetchCharacterById = async (id: string): Promise<Character> => {
  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Unable to load character details. Please try again.");
  }

  return response.json() as Promise<Character>;
};
