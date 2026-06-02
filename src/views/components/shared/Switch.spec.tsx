import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Switch from './Switch';

const TABS = [
  { id: 'all', label: 'Tous' },
  { id: 'active', label: 'Actifs' },
  { id: 'expired', label: 'Expiré' },
];

describe('Switch', () => {
  it('21.1 renders all tabs', () => {
    /* Arrange / Act */
    render(<Switch activeTab="all" tabs={TABS} onTabChange={vi.fn()} />);

    /* Assert */
    expect(screen.getByText('Tous')).toBeInTheDocument();
    expect(screen.getByText('Actifs')).toBeInTheDocument();
    expect(screen.getByText('Expiré')).toBeInTheDocument();
  });

  it('21.2 active tab has is-active class', () => {
    /* Arrange / Act */
    render(<Switch activeTab="active" tabs={TABS} onTabChange={vi.fn()} />);

    /* Assert */
    expect(screen.getByText('Actifs')).toHaveClass('is-active');
    expect(screen.getByText('Tous')).not.toHaveClass('is-active');
  });

  it('21.3 calls onTabChange on click', async () => {
    /* Arrange */
    const onTabChange = vi.fn();
    render(<Switch activeTab="all" tabs={TABS} onTabChange={onTabChange} />);

    /* Act */
    await userEvent.click(screen.getByText('Expiré'));

    /* Assert */
    expect(onTabChange).toHaveBeenCalledWith('expired');
  });
});
