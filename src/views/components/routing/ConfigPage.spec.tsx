import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ConfigPage from './ConfigPage';
import useAuthStore from '../../../stores/authStore';

const renderConfigPage = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ConfigPage />
    </MemoryRouter>,
  );

describe('ConfigPage', () => {
  it('33.1 affiche la navbar et le footer', () => {
    /* Arrange */
    useAuthStore.setState({ isAuthenticated: false } as any);

    /* Act */
    renderConfigPage();

    /* Assert */
    expect(screen.getByText('DataShare')).toBeInTheDocument();
    expect(screen.getByText('Copyright DataShare 2026')).toBeInTheDocument();
  });

  it('33.2 affiche "Se connecter" sur / si non authentifié', () => {
    /* Arrange */
    useAuthStore.setState({ isAuthenticated: false } as any);

    /* Act */
    renderConfigPage('/');

    /* Assert */
    expect(screen.getByText('Se connecter')).toBeInTheDocument();
  });

  it('33.3 affiche "Mon espace" si authentifié', () => {
    /* Arrange */
    useAuthStore.setState({ isAuthenticated: true } as any);

    /* Act */
    renderConfigPage('/');

    /* Assert */
    expect(screen.getByText('Mon espace')).toBeInTheDocument();
  });
});
