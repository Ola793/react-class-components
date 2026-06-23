import Image from "next/image";
import { Link } from "../i18n/navigation";
import type { Character } from "../types/character";
import { SelectedItemCheckbox } from "./SelectedItemCheckbox";

interface CardProps {
  character: Character;
  currentPage: number;
  searchTerm: string;
}

export function Card({ character, currentPage, searchTerm }: CardProps) {
  const params = new URLSearchParams();

  params.set("page", String(currentPage));
  params.set("details", String(character.id));

  if (searchTerm) {
    params.set("query", searchTerm);
  }

  return (
    <article className="card">
      <div className="card__button">
        <SelectedItemCheckbox character={character} />

        <Image
          src={character.image}
          alt={character.name}
          width={120}
          height={120}
          className="card__image"
        />

        <Link href={`/?${params.toString()}`} className="card__content">
          <h3 className="card__title">{character.name}</h3>
          <p className="card__description">
            {character.status} — {character.species}
          </p>
        </Link>
      </div>
    </article>
  );
}