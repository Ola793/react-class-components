import type { Character } from '../types/character';
import { Card } from './Card';

interface CardListProps {
  characters: Character[];
  onSelect: (characterId: number) => void;
}

export function CardList({ characters, onSelect }: CardListProps) {
  if (characters.length === 0) {
    return <p className="empty-message">No results found.</p>;
  }

  return (
    <div className="card-list">
      {characters.map((character) => (
        <Card
          key={character.id}
          character={character}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}