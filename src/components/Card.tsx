import type { Character } from '../types/character';

interface CardProps {
  character: Character;
  onSelect: (characterId: number) => void;
}

export function Card({ character, onSelect }: CardProps) {
  return (
    <article className="card">
      <button
        className="card__button"
        type="button"
        onClick={() => onSelect(character.id)}
      >
        <img
          src={character.image}
          alt={character.name}
          className="card__image"
        />
        <div>
          <h3 className="card__title">{character.name}</h3>
          <p className="card__description">
            {character.status} — {character.species}
          </p>
        </div>
      </button>
    </article>
  );
}