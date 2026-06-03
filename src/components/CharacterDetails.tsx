import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { Loader } from "./Loader";
import { useCharacterDetailsQuery } from "../hooks/useCharacterDetailsQuery";
import { queryKeys } from "../query/queryKeys";

interface DetailsContext {
  characterId: string | null;
  onClose: () => void;
}

export function CharacterDetails() {
  const { characterId, onClose } = useOutletContext<DetailsContext>();
  const queryClient = useQueryClient();
  const [isRefreshingDetails, setIsRefreshingDetails] = useState(false);
  const { data, isLoading, isError, error, refetch } = useCharacterDetailsQuery(characterId);

  if (!characterId) {
    return null;
  }

  const handleRefresh = async () => {
    setIsRefreshingDetails(true);

    try {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.characterDetails(characterId),
        refetchType: "none",
      });

      await refetch();
    } finally {
      setIsRefreshingDetails(false);
    }
  };

  const errorMessage = error instanceof Error ? error.message : "Unable to load character details. Please try again.";

  return (
    <aside className="details-panel">
      <button type="button" className="details-panel__close" onClick={onClose}>
        Close
      </button>

      <button type="button" className="refresh-button" onClick={handleRefresh} disabled={isRefreshingDetails}>
        {isRefreshingDetails ? "Refreshing..." : "Refresh details"}
      </button>

      {isLoading && <Loader />}

      {!isLoading && isError && <p className="error-message">{errorMessage}</p>}

      {!isLoading && data && (
        <>
          <img src={data.image} alt={data.name} className="details-panel__image" />
          <h2>{data.name}</h2>
          <p>Status: {data.status}</p>
          <p>Species: {data.species}</p>
          {data.gender && <p>Gender: {data.gender}</p>}
          {data.origin && <p>Origin: {data.origin.name}</p>}
          {data.location && <p>Location: {data.location.name}</p>}
        </>
      )}
    </aside>
  );
}
