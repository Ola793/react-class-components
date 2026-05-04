import { Component } from 'react';
import type { Character } from '../types/character';
import { Card } from './Card';

interface CardListProps {
  characters: Character[];
}

export class CardList extends Component<CardListProps> {
  render() {
    const { characters } = this.props;

    if (characters.length === 0) {
      return <p className="empty-message">No results found.</p>;
    }

    return (
      <div className="card-list">
        {characters.map((character) => (
          <Card key={character.id} character={character} />
        ))}
      </div>
    );
  }
}