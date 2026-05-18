import type { Character } from '../types/character';

interface CardProps {
  character: Character;
}

export function Card({ character }: CardProps) {
  return (
    <article className="card">
      <img src={character.image} alt={character.name} className="card__image" />
      <div>
        <h3 className="card__title">{character.name}</h3>
        <p className="card__description">
          {character.status} — {character.species}
        </p>
      </div>
    </article>
  );
}