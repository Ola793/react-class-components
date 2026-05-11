import { render, screen } from '@testing-library/react';
import { Loader } from './Loader';

describe('Loader', () => {
  it('renders loading indicator', () => {
    render(<Loader />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});