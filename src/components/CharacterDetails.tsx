import Image from "next/image";
import { fetchCharacterById } from "../api/charactersApi";
import { Link } from "../i18n/navigation";

interface CharacterDetailsProps {
  characterId: string;
  currentPage: number;
  searchTerm: string;
}

const createCloseHref = (currentPage: number, searchTerm: string) => {
  const params = new URLSearchParams();

  params.set("page", String(currentPage));

  if (searchTerm) {
    params.set("query", searchTerm);
  }

  return `/?${params.toString()}`;
};

export async function CharacterDetails({
  characterId,
  currentPage,
  searchTerm,
}: CharacterDetailsProps) {
  let errorMessage = "";
  let character = null;

  try {
    character = await fetchCharacterById(characterId);
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Unable to load character details. Please try again.";
  }

  return (
    <aside className="details-panel">
      <Link href={createCloseHref(currentPage, searchTerm)} className="details-panel__close">
        Close
      </Link>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {character && (
        <>
          <Image
            src={character.image}
            alt={character.name}
            width={300}
            height={300}
            className="details-panel__image"
          />
          <h2>{character.name}</h2>
          <p>Status: {character.status}</p>
          <p>Species: {character.species}</p>
          {character.gender && <p>Gender: {character.gender}</p>}
          {character.origin && <p>Origin: {character.origin.name}</p>}
          {character.location && <p>Location: {character.location.name}</p>}
        </>
      )}
    </aside>
  );
}