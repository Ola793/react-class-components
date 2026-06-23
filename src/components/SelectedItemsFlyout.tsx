"use client";

import { useSelectedItemsStore } from "../store/selectedItemsStore";

export function SelectedItemsFlyout() {
  const selectedItems = useSelectedItemsStore((state) => state.selectedItems);
  const clearItems = useSelectedItemsStore((state) => state.clearItems);

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <aside className="selected-flyout">
      <p>Selected items: {selectedItems.length}</p>

      <form action="/api/csv" method="post">
        {selectedItems.map((item) => (
          <input key={item.id} type="hidden" name="ids" value={item.id} />
        ))}

        <button type="submit">Download</button>
      </form>

      <button type="button" onClick={clearItems}>
        Unselect all
      </button>
    </aside>
  );
}