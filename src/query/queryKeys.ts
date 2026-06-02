export const queryKeys = {
  characters: (searchTerm: string, page: number) =>
    ['characters', searchTerm, page] as const,

  characterDetails: (characterId: string) =>
    ['characterDetails', characterId] as const,
};