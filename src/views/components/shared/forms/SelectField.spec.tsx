import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SelectField from './SelectField';

const OPTIONS = [
  { value: '1', label: '1 jour' },
  { value: '7', label: '7 jours' },
];

describe('SelectField', () => {
  it('25.1 affiche le label et le select', () => {
    /* Arrange / Act */
    render(<SelectField id="exp" label="Expiration" options={OPTIONS} />);

    /* Assert */
    expect(screen.getByLabelText('Expiration')).toBeInTheDocument();
  });

  it('25.2 affiche toutes les options', () => {
    /* Arrange / Act */
    render(<SelectField id="exp" label="Expiration" options={OPTIONS} />);

    /* Assert */
    expect(screen.getByRole('option', { name: '1 jour' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '7 jours' })).toBeInTheDocument();
  });

  it('25.3 affiche le message d\'erreur', () => {
    /* Arrange / Act */
    render(<SelectField id="exp" label="Expiration" options={OPTIONS} error="Champ requis" />);

    /* Assert */
    expect(screen.getByText('Champ requis')).toBeInTheDocument();
  });
});
