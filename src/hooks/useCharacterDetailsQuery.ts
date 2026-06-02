import { useQuery } from "@tanstack/react-query";
import { fetchCharacterById } from "../api/charactersApi";
import { queryKeys } from "../query/queryKeys";

export function useCharacterDetailsQuery(characterId: string | null) {
  return useQuery({
    queryKey: queryKeys.characterDetails(characterId ?? ""),
    queryFn: () => fetchCharacterById(characterId ?? ""),
    enabled: Boolean(characterId),
  });
}
