import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useOutletContext } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchCharacterById } from '../api/charactersApi';
import type { Character } from '../types/character';
import { CharacterDetails } from './CharacterDetails';

vi.mock('react-router-dom', () => ({
  useOutletContext: vi.fn(),
}));

vi.mock('../api/charactersApi', () => ({
  fetchCharacterById: vi.fn(),
}));

const mockedUseOutletContext = vi.mocked(useOutletContext);
const mockedFetchCharacterById = vi.mocked(fetchCharacterById);

const rick: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  image: 'https://example.com/rick.png',
  origin: {
    name: 'Earth',
  },
  location: {
    name: 'Citadel of Ricks',
  },
};

describe('CharacterDetails', () => {
  beforeEach(() => {
    mockedUseOutletContext.mockReset();
    mockedFetchCharacterById.mockReset();
  });

  it('renders nothing when character id is missing', () => {
    mockedUseOutletContext.mockReturnValue({
      characterId: null,
      onClose: vi.fn(),
    });

    const { container } = render(<CharacterDetails />);

    expect(container).toBeEmptyDOMElement();
  });

  it('loads and renders character details', async () => {
    mockedUseOutletContext.mockReturnValue({
      characterId: '1',
      onClose: vi.fn(),
    });
    mockedFetchCharacterById.mockResolvedValue(rick);

    render(<CharacterDetails />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    expect(
      await screen.findByRole('heading', { name: /rick sanchez/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/status: alive/i)).toBeInTheDocument();
    expect(screen.getByText(/species: human/i)).toBeInTheDocument();
    expect(screen.getByText(/gender: male/i)).toBeInTheDocument();
    expect(screen.getByText(/origin: earth/i)).toBeInTheDocument();
    expect(screen.getByText(/location: citadel of ricks/i)).toBeInTheDocument();
  });

  it('shows error message when character details request fails', async () => {
    mockedUseOutletContext.mockReturnValue({
      characterId: '1',
      onClose: vi.fn(),
    });
    mockedFetchCharacterById.mockRejectedValue(
      new Error('Unable to load character details.')
    );

    render(<CharacterDetails />);

    expect(
      await screen.findByText(/unable to load character details/i)
    ).toBeInTheDocument();
  });

  it('calls onClose after clicking close button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    mockedUseOutletContext.mockReturnValue({
      characterId: '1',
      onClose,
    });
    mockedFetchCharacterById.mockResolvedValue(rick);

    render(<CharacterDetails />);

    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(onClose).toHaveBeenCalledOnce();
  });
});