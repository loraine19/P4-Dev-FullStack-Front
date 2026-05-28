import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Callout from './Callout';

describe('Callout', () => {

  /* CA.1 no props → null */
  it('7.1.1 renders nothing when no message and no error', () => {
    /* Act */
    const { container } = render(<Callout />);

    /* Assert */
    expect(container.firstChild).toBeNull();
  });

  /* CA.2 message prop */
  it('7.2.1 displays message text when message prop provided', () => {
    /* Act */
    render(<Callout message="Fichier uploadé avec succès" variant="success" />);

    /* Assert */
    expect(screen.getByText(/Fichier uploadé avec succès/)).toBeInTheDocument();
  });

  /* CA.3 error prop */
  it('7.3.1 displays error message from error object', () => {
    /* Arrange */
    const error = { level: 'error' as const, message: 'Identifiants incorrects' };

    /* Act */
    render(<Callout error={error} />);

    /* Assert */
    expect(screen.getByText(/Identifiants incorrects/)).toBeInTheDocument();
  });

  /* CA.4 error level → variant class */
  it('7.4.1 error level applies callout-error class', () => {
    /* Arrange */
    const error = { level: 'error' as const, message: 'Erreur' };

    /* Act */
    render(<Callout error={error} />);

    /* Assert */
    expect(screen.getByText(/Erreur/).closest('p')).toHaveClass('callout-error');
  });

  it('7.4.2 warning level applies callout-warning class', () => {
    /* Arrange */
    const error = { level: 'warning' as const, message: 'Attention' };

    /* Act */
    render(<Callout error={error} />);

    /* Assert */
    expect(screen.getByText(/Attention/).closest('p')).toHaveClass('callout-warning');
  });
});
