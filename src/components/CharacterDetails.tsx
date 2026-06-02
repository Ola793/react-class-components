import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { fetchCharacterById } from "../api/charactersApi";
import type { Character } from "../types/character";
import { Loader } from "./Loader";

interface DetailsContext {
  characterId: string | null;
  onClose: () => void;
}

interface CharacterDetailsState {
  loadedCharacterId: string | null;
  character: Character | null;
  errorMessage: string;
}

export function CharacterDetails() {
  const { characterId, onClose } = useOutletContext<DetailsContext>();
  const [detailsState, setDetailsState] = useState<CharacterDetailsState>({
    loadedCharacterId: null,
    character: null,
    errorMessage: "",
  });

  useEffect(() => {
    if (!characterId) {
      return;
    }

    let isActualRequest = true;

    const loadCharacter = async () => {
      try {
        const data = await fetchCharacterById(characterId);

        if (!isActualRequest) {
          return;
        }

        setDetailsState({
          loadedCharacterId: characterId,
          character: data,
          errorMessage: "",
        });
      } catch (error) {
        if (!isActualRequest) {
          return;
        }

        const message = error instanceof Error ? error.message : "Unable to load character details. Please try again.";

        setDetailsState({
          loadedCharacterId: characterId,
          character: null,
          errorMessage: message,
        });
      }
    };

    void loadCharacter();

    return () => {
      isActualRequest = false;
    };
  }, [characterId]);

  if (!characterId) {
    return null;
  }

  const isLoading = detailsState.loadedCharacterId !== characterId;

  return (
    <aside className="details-panel">
      <button type="button" className="details-panel__close" onClick={onClose}>
        Close
      </button>

      {isLoading && <Loader />}

      {!isLoading && detailsState.errorMessage && <p className="error-message">{detailsState.errorMessage}</p>}

      {!isLoading && detailsState.character && (
        <>
          <img src={detailsState.character.image} alt={detailsState.character.name} className="details-panel__image" />
          <h2>{detailsState.character.name}</h2>
          <p>Status: {detailsState.character.status}</p>
          <p>Species: {detailsState.character.species}</p>
          {detailsState.character.gender && <p>Gender: {detailsState.character.gender}</p>}
          {detailsState.character.origin && <p>Origin: {detailsState.character.origin.name}</p>}
          {detailsState.character.location && <p>Location: {detailsState.character.location.name}</p>}
        </>
      )}
    </aside>
  );
}
