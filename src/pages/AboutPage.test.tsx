import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AboutPage } from './AboutPage';

describe('AboutPage', () => {
  it('renders about page content', () => {
    render(<AboutPage />);

    expect(
      screen.getByRole('heading', { name: /about/i })
    ).toBeInTheDocument();
  });
});