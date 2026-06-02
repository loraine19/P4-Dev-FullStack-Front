import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PageHeader from './PageHeader';

describe('PageHeader', () => {
  it('20.1 renders title', () => {
    /* Arrange / Act */
    render(<PageHeader title="Mon titre" />);

    /* Assert */
    expect(screen.getByRole('heading', { name: 'Mon titre' })).toBeInTheDocument();
  });

  it('20.2 renders subtitle when provided', () => {
    /* Arrange / Act */
    render(<PageHeader title="Titre" subtitle="Mon sous-titre" />);

    /* Assert */
    expect(screen.getByText('Mon sous-titre')).toBeInTheDocument();
  });

  it('20.3 hides subtitle when absent', () => {
    /* Arrange / Act */
    render(<PageHeader title="Titre" />);

    /* Assert */
    expect(screen.queryByText('Mon sous-titre')).not.toBeInTheDocument();
  });
});
