import { describe, it, expect } from 'vitest';
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
  it('33.1 renders navbar and footer', () => {
    /* Arrange */
    useAuthStore.setState({ isAuthenticated: false } as any);

    /* Act */
    renderConfigPage();

    /* Assert */
    expect(screen.getByText('DataShare')).toBeInTheDocument();
    expect(screen.getByText('Copyright DataShare 2026')).toBeInTheDocument();
  });

  it('33.2 shows Sign in on / when not authenticated', () => {
    /* Arrange */
    useAuthStore.setState({ isAuthenticated: false } as any);

    /* Act */
    renderConfigPage('/');

    /* Assert */
    expect(screen.getByText('Se connecter')).toBeInTheDocument();
  });

  it('33.3 shows My space when authenticated', () => {
    /* Arrange */
    useAuthStore.setState({ isAuthenticated: true } as any);

    /* Act */
    renderConfigPage('/');

    /* Assert */
    expect(screen.getByText('Mon espace')).toBeInTheDocument();
  });
});
