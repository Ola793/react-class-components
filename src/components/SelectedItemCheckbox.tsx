"use client";

import type { ChangeEvent } from "react";
import { useSelectedItemsStore } from "../store/selectedItemsStore";
import type { Character } from "../types/character";

interface SelectedItemCheckboxProps {
  character: Character;
}

export function SelectedItemCheckbox({ character }: SelectedItemCheckboxProps) {
  const selectedItems = useSelectedItemsStore((state) => state.selectedItems);
  const toggleItem = useSelectedItemsStore((state) => state.toggleItem);

  const isSelected = selectedItems.some((item) => item.id === character.id);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    toggleItem(character);
  };

  return (
    <label className="card__checkbox">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleChange}
        aria-label={`Select ${character.name}`}
      />
    </label>
  );
}