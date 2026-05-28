import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('18.1 affiche le texte par défaut', () => {
    /* Arrange / Act */
    render(<Footer />);

    /* Assert */
    expect(screen.getByText('Copyright DataShare 2026')).toBeInTheDocument();
  });

  it('18.2 affiche un texte personnalisé', () => {
    /* Arrange / Act */
    render(<Footer text="Mon texte footer" />);

    /* Assert */
    expect(screen.getByText('Mon texte footer')).toBeInTheDocument();
  });
});
