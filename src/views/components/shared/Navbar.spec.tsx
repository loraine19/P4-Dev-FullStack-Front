import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('19.1 affiche le logo DataShare', () => {
    /* Arrange / Act */
    render(<MemoryRouter><Navbar /></MemoryRouter>);

    /* Assert */
    expect(screen.getByText('DataShare')).toBeInTheDocument();
  });

  it('19.2 affiche le lien CTA par défaut (Se connecter)', () => {
    /* Arrange / Act */
    render(<MemoryRouter><Navbar /></MemoryRouter>);

    /* Assert */
    expect(screen.getByText('Se connecter')).toBeInTheDocument();
  });

  it('19.3 affiche un label CTA personnalisé', () => {
    /* Arrange / Act */
    render(<MemoryRouter><Navbar ctaLabel="Mon espace" ctaPath="/my-space" /></MemoryRouter>);

    /* Assert */
    expect(screen.getByText('Mon espace')).toBeInTheDocument();
  });
});
