import { useQuery } from '@tanstack/react-query';
import { fetchCharacters } from '../api/charactersApi';
import { queryKeys } from '../query/queryKeys';

export function useCharactersQuery(searchTerm: string, page: number) {
  return useQuery({
    queryKey: queryKeys.characters(searchTerm, page),
    queryFn: () => fetchCharacters(searchTerm, page),
  });
}