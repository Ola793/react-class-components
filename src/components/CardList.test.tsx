import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CardList } from './CardList';
import type { Character } from '../types/character';

const characters: Character[] = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    image: 'https://example.com/rick.png',
  },
  {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    image: 'https://example.com/morty.png',
  },
];

describe('CardList', () => {
  it('renders all provided characters', () => {
    render(<CardList characters={characters} />);

    expect(screen.getByText(/rick sanchez/i)).toBeInTheDocument();
    expect(screen.getByText(/morty smith/i)).toBeInTheDocument();
  });

  it('renders empty message when there are no characters', () => {
    render(<CardList characters={[]} />);

    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });
});