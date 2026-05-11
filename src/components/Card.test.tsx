import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';
import type { Character } from '../types/character';

const character: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  image: 'https://example.com/rick.png',
};

describe('Card', () => {
  it('renders character name, description and image', () => {
    render(<Card character={character} />);

    expect(screen.getByRole('heading', { name: /rick sanchez/i })).toBeInTheDocument();
    expect(screen.getByText(/alive/i)).toBeInTheDocument();
    expect(screen.getByText(/human/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /rick sanchez/i })).toHaveAttribute(
      'src',
      character.image
    );
  });
});