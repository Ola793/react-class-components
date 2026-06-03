import { useSelectedItemsStore } from "../store/selectedItemsStore";
import { downloadSelectedItemsCsv } from "../utils/downloadCsv";

export function SelectedItemsFlyout() {
  const selectedItems = useSelectedItemsStore((state) => state.selectedItems);
  const clearItems = useSelectedItemsStore((state) => state.clearItems);

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <div className="selected-flyout">
      <p>Selected items: {selectedItems.length}</p>

      <button type="button" onClick={clearItems}>
        Unselect all
      </button>

      <button type="button" onClick={() => downloadSelectedItemsCsv(selectedItems)}>
        Download
      </button>
    </div>
  );
}
