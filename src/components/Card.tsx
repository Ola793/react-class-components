import type { ChangeEvent } from 'react';
import { useSelectedItemsStore } from '../store/selectedItemsStore';
import type { Character } from '../types/character';

interface CardProps {
  character: Character;
  onSelect: (characterId: number) => void;
}

export function Card({ character, onSelect }: CardProps) {
  const selectedItems = useSelectedItemsStore((state) => state.selectedItems);
  const toggleItem = useSelectedItemsStore((state) => state.toggleItem);

  const isSelected = selectedItems.some((item) => item.id === character.id);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    toggleItem(character);
  };

  return (
    <article className="card">
      <button
        className="card__button"
        type="button"
        onClick={() => onSelect(character.id)}
      >
        <label className="card__checkbox" onClick={(event) => event.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            aria-label={`Select ${character.name}`}
          />
        </label>

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