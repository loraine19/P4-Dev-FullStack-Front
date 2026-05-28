import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import useAuthStore from '../../stores/authStore';

const RESET = { user: null, isAuthenticated: false, isLoading: false, error: null };

beforeEach(() => {
  useAuthStore.setState({ ...RESET, login: vi.fn(), register: vi.fn(), logout: vi.fn(), clearError: vi.fn() });
});

describe('WelcomePage', () => {

  /* WP.1.1 no auth param → shows UploadCall (not auth forms) */
  it('13.1.1 no auth query param → does not show Connexion or Créer un compte form', () => {
    /* Act */
    render(
      <MemoryRouter initialEntries={['/']}>
        <WelcomePage />
      </MemoryRouter>,
    );

    /* Assert */
    expect(screen.queryByRole('heading', { name: 'Connexion' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Créer un compte' })).not.toBeInTheDocument();
  });

  /* WP.1.2 auth=login → shows LoginForm */
  it('13.1.2 auth=login → shows Connexion form', () => {
    /* Act */
    render(
      <MemoryRouter initialEntries={['/?auth=login']}>
        <WelcomePage />
      </MemoryRouter>,
    );

    /* Assert */
    expect(screen.getByRole('heading', { name: 'Connexion' })).toBeInTheDocument();
  });

  /* WP.1.3 auth=register → shows RegisterForm */
  it('13.1.3 auth=register → shows Créer un compte form', () => {
    /* Act */
    render(
      <MemoryRouter initialEntries={['/?auth=register']}>
        <WelcomePage />
      </MemoryRouter>,
    );

    /* Assert */
    expect(screen.getByRole('heading', { name: 'Créer un compte' })).toBeInTheDocument();
  });

  /* WP.1.4 click switch from login → shows register form */
  it('13.1.4 clicking Créer un compte from login view → switches to register form', () => {
    /* Act */
    render(
      <MemoryRouter initialEntries={['/?auth=login']}>
        <WelcomePage />
      </MemoryRouter>,
    );

    /* Assert initial state */
    expect(screen.getByRole('heading', { name: 'Connexion' })).toBeInTheDocument();

    /* Act -  click switch to register */
    fireEvent.click(screen.getByText('Créer un compte'));

    /* Assert */
    expect(screen.getByRole('heading', { name: 'Créer un compte' })).toBeInTheDocument();
  });
});
