import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContextMenu from './ContextMenu';

const ITEMS = [
  { label: 'Télécharger', action: vi.fn() },
  { label: 'Supprimer', action: vi.fn() },
];

describe('ContextMenu', () => {
  it('24.1 renders Options trigger button', () => {
    /* Arrange / Act */
    render(<ContextMenu items={ITEMS} />);

    /* Assert */
    expect(screen.getByRole('button', { name: 'Options' })).toBeInTheDocument();
  });

  it('24.2 menu closed by default · aria-expanded false', () => {
    /* Arrange / Act */
    render(<ContextMenu items={ITEMS} />);

    /* Assert */
    expect(screen.queryByText('Télécharger')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Options' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('24.3 opens menu on trigger click · aria-expanded true', async () => {
    /* Arrange */
    render(<ContextMenu items={ITEMS} />);

    /* Act */
    await userEvent.click(screen.getByRole('button', { name: 'Options' }));

    /* Assert */
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Options' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('24.4 runs action and closes menu on item click', async () => {
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
