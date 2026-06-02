import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import useAuthStore from '../../../stores/authStore';

const RESET = { user: null, isAuthenticated: false, isLoading: false, error: null };

beforeEach(() => {
  useAuthStore.setState({ ...RESET, register: vi.fn(), clearError: vi.fn() });
});

const renderRegisterForm = (onSwitch = vi.fn()) =>
  render(
    <MemoryRouter>
      <RegisterForm onSwitch={onSwitch} />
    </MemoryRouter>,
  );

describe('RegisterForm', () => {
  it('27.1 renders name, email, password, passwordConfirm', () => {
    /* Arrange / Act */
    renderRegisterForm();

    /* Assert */
    expect(screen.getByLabelText('Nom')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByLabelText('Vérification du mot de passe')).toBeInTheDocument();
  });

  it('27.2 renders store error message', () => {
    /* Arrange */
    useAuthStore.setState({ error: { level: 'error', message: 'Email déjà utilisé' } });

    /* Act */
    renderRegisterForm();

    /* Assert */
    expect(screen.getByRole('alert')).toHaveTextContent('Email déjà utilisé');
  });

  it('27.3 valid submit → calls register with name/email/password', async () => {
    /* Arrange */
    const mockRegister = vi.fn().mockResolvedValue(true);
    const onSwitch = vi.fn();
    useAuthStore.setState({ register: mockRegister });
    renderRegisterForm(onSwitch);

    /* Act */
    await userEvent.type(screen.getByLabelText('Nom'), 'Alice');
    await userEvent.type(screen.getByLabelText('Email'), 'alice@test.com');
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'Password1!');
    await userEvent.type(screen.getByLabelText('Vérification du mot de passe'), 'Password1!');
    await userEvent.click(screen.getByRole('button', { name: 'Créer un compte' }));

    /* Assert */
    await waitFor(() =>
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Alice',
        email: 'alice@test.com',
        password: 'Password1!',
      }),
    );
  });

  it('27.4 register success → calls onSwitch', async () => {
    /* Arrange */
    const mockRegister = vi.fn().mockResolvedValue(true);
    const onSwitch = vi.fn();
    useAuthStore.setState({ register: mockRegister });
    renderRegisterForm(onSwitch);

    /* Act */
    await userEvent.type(screen.getByLabelText('Nom'), 'Alice');
    await userEvent.type(screen.getByLabelText('Email'), 'alice@test.com');
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'Password1!');
    await userEvent.type(screen.getByLabelText('Vérification du mot de passe'), 'Password1!');
    await userEvent.click(screen.getByRole('button', { name: 'Créer un compte' }));

    /* Assert */
    await waitFor(() => expect(onSwitch).toHaveBeenCalledOnce());
  });
});
