import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { NotFoundPage } from './NotFoundPage';

describe('NotFoundPage', () => {
  it('renders 404 message and return link', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
    expect(
      screen.getByText(/page not found/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /back to main page/i })
    ).toBeInTheDocument();
  });
});