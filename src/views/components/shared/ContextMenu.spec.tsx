import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@project-lary/react-material-symbols', () => ({
  MoreVert: () => null,
}));

import ContextMenu from './ContextMenu';

const ITEMS = [
  { label: 'Télécharger', action: vi.fn() },
  { label: 'Supprimer', action: vi.fn() },
];

describe('ContextMenu', () => {
  it('24.1 affiche le bouton trigger Options', () => {
    /* Arrange / Act */
    render(<ContextMenu items={ITEMS} />);

    /* Assert */
    expect(screen.getByRole('button', { name: 'Options' })).toBeInTheDocument();
  });

  it('24.2 le menu est fermé par défaut', () => {
    /* Arrange / Act */
    render(<ContextMenu items={ITEMS} />);

    /* Assert */
    expect(screen.queryByText('Télécharger')).not.toBeInTheDocument();
  });

  it('24.3 ouvre le menu au clic sur trigger', async () => {
    /* Arrange */
    render(<ContextMenu items={ITEMS} />);

    /* Act */
    await userEvent.click(screen.getByRole('button', { name: 'Options' }));

    /* Assert */
    expect(screen.getByText('Télécharger')).toBeInTheDocument();
    expect(screen.getByText('Supprimer')).toBeInTheDocument();
  });

  it('24.4 appelle l\'action et ferme le menu au clic sur un item', async () => {
    /* Arrange */
    const action = vi.fn();
    render(<ContextMenu items={[{ label: 'Télécharger', action }]} />);
    await userEvent.click(screen.getByRole('button', { name: 'Options' }));

    /* Act */
    await userEvent.click(screen.getByText('Télécharger'));

    /* Assert */
    expect(action).toHaveBeenCalledOnce();
    expect(screen.queryByText('Télécharger')).not.toBeInTheDocument();
  });
});
