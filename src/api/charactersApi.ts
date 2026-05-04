import type { Character, CharactersResponse } from '../types/character';

const BASE_URL = 'https://rickandmortyapi.com/api/character';

export const fetchCharacters = async (searchTerm: string): Promise<Character[]> => {
  const params = new URLSearchParams();

  params.set('page', '1');

  if (searchTerm) {
    params.set('name', searchTerm);
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Unable to load characters. Please try another search term.');
  }

  const data: CharactersResponse = await response.json();

  return data.results;
};