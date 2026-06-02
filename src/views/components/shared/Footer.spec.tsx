import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('18.1 renders default text', () => {
    /* Arrange / Act */
    render(<Footer />);

    /* Assert */
    expect(screen.getByText('Copyright DataShare 2026')).toBeInTheDocument();
  });

  it('18.2 renders custom text', () => {
    /* Arrange / Act */
    render(<Footer text="Mon texte footer" />);

    /* Assert */
    expect(screen.getByText('Mon texte footer')).toBeInTheDocument();
  });
});
