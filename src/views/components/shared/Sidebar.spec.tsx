import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from './Sidebar';

describe('Sidebar', () => {
  it('22.1 renders open sidebar when isOpen=true', () => {
    /* Arrange / Act */
    render(
      <Sidebar isOpen={true} onClose={vi.fn()} onAddFiles={vi.fn()} onLogout={vi.fn()} />,
    );

    /* Assert */
    expect(screen.getByRole('complementary')).toHaveClass('is-open');
  });

  it('22.2 no is-open class when isOpen=false', () => {
    /* Arrange / Act */
    render(
      <Sidebar isOpen={false} onClose={vi.fn()} onAddFiles={vi.fn()} onLogout={vi.fn()} />,
    );

    /* Assert */
    expect(screen.getByRole('complementary')).not.toHaveClass('is-open');
  });

  it('22.3 calls onLogout on Sign out click', async () => {
    /* Arrange */
    const onLogout = vi.fn();
    render(
      <Sidebar isOpen={true} onClose={vi.fn()} onAddFiles={vi.fn()} onLogout={onLogout} />,
    );

    /* Act */
    await userEvent.click(screen.getByText('Déconnexion'));

    /* Assert */
    expect(onLogout).toHaveBeenCalledOnce();
  });

  it('22.4 calls onAddFiles on Add files click', async () => {
    /* Arrange */
    const onAddFiles = vi.fn();
    render(
      <Sidebar isOpen={true} onClose={vi.fn()} onAddFiles={onAddFiles} onLogout={vi.fn()} />,
    );

    /* Act */
    await userEvent.click(screen.getByText('Ajouter des fichiers'));

    /* Assert */
    expect(onAddFiles).toHaveBeenCalledOnce();
  });
});
