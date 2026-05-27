import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import type { Character } from '../types/character';
import { useSelectedItemsStore } from '../store/selectedItemsStore';
import { SelectedItemsFlyout } from './SelectedItemsFlyout';

const rick: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  image: 'https://example.com/rick.png',
};

describe('SelectedItemsFlyout', () => {
  beforeEach(() => {
    useSelectedItemsStore.setState({ selectedItems: [] });
  });

  it('is hidden when no items are selected', () => {
    render(<SelectedItemsFlyout />);

    expect(screen.queryByText(/selected items/i)).not.toBeInTheDocument();
  });

  it('shows selected items count', () => {
    useSelectedItemsStore.setState({ selectedItems: [rick] });

    render(<SelectedItemsFlyout />);

    expect(screen.getByText(/selected items: 1/i)).toBeInTheDocument();
  });

  it('clears selected items after clicking unselect all', async () => {
    const user = userEvent.setup();

    useSelectedItemsStore.setState({ selectedItems: [rick] });

    render(<SelectedItemsFlyout />);

    await user.click(screen.getByRole('button', { name: /unselect all/i }));

    expect(screen.queryByText(/selected items/i)).not.toBeInTheDocument();
  });
});