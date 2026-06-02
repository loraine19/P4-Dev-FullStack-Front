import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from './LoginForm';
import useAuthStore from '../../../stores/authStore';

const RESET = { user: null, isAuthenticated: false, isLoading: false, error: null };

beforeEach(() => {
  useAuthStore.setState({ ...RESET, login: vi.fn(), clearError: vi.fn() });
});

const renderLoginForm = () =>
  render(
    <MemoryRouter>
      <LoginForm onSwitch={vi.fn()} />
    </MemoryRouter>,
  );

describe('LoginForm', () => {

  /* LF.1.1 renders the form */
  it('12.1.1 renders email and password inputs', () => {
    /* Act */
    renderLoginForm();

    /* Assert */
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
  });

  /* LF.1.2 displays store error message */
  it('12.1.2 displays error from auth store', () => {
    /* Arrange */
    useAuthStore.setState({ error: { level: 'error', message: 'Identifiants incorrects' } });

    /* Act */
    renderLoginForm();

    /* Assert */
    expect(screen.getByRole('alert')).toHaveTextContent('Identifiants incorrects');
  });

  /* LF.1.3 submit with valid credentials → calls login */
  it('12.2.1 valid submit → calls store login with email and password', async () => {
    /* Arrange */
    const mockLogin = vi.fn().mockResolvedValue(true);
    useAuthStore.setState({ login: mockLogin });
    renderLoginForm();

    /* Act */
    await userEvent.type(screen.getByLabelText('Email'), 'alice@test.com');
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'secretMdp');
    await userEvent.click(screen.getByRole('button', { name: 'Connexion' }));

    /* Assert */
    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith({ email: 'alice@test.com', password: 'secretMdp' }),
    );
  });
});
