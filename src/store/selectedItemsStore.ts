import { create } from "zustand";
import type { Character } from "../types/character";

interface SelectedItemsState {
  selectedItems: Character[];
  toggleItem: (item: Character) => void;
  clearItems: () => void;
}

export const useSelectedItemsStore = create<SelectedItemsState>((set) => ({
  selectedItems: [],

  toggleItem: (item) =>
    set((state) => {
      const isSelected = state.selectedItems.some((selectedItem) => selectedItem.id === item.id);

      return {
        selectedItems: isSelected
          ? state.selectedItems.filter((selectedItem) => selectedItem.id !== item.id)
          : [...state.selectedItems, item],
      };
    }),

  clearItems: () => set({ selectedItems: [] }),
}));
