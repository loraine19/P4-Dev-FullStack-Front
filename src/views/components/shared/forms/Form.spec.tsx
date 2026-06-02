import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from './Form';
import { LOGIN_INPUTS } from '../../../../constants/formConfigs';

const SUBMIT_LABEL = 'Se connecter';

describe('Form', () => {

  /* FM.1 renders */
  describe('FM.1 renders', () => {
    it('9.1.1 renders title and all input labels', () => {
      /* Act */
      render(
        <Form id="login" title="Connexion" inputs={LOGIN_INPUTS} onSubmit={vi.fn()} submitLabel={SUBMIT_LABEL} />,
      );

      /* Assert */
      expect(screen.getByRole('heading', { name: 'Connexion' })).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    });

    it('9.1.2 shows error callout when error prop is set', () => {
      /* Act */
      render(
        <Form
          id="login"
          title="Connexion"
          inputs={LOGIN_INPUTS}
          onSubmit={vi.fn()}
          submitLabel={SUBMIT_LABEL}
          error="Identifiants incorrects"
        />,
      );

      /* Assert */
      expect(screen.getByRole('alert')).toHaveTextContent('Identifiants incorrects');
    });

    it('9.1.3 loading → button shows submitLabel... and is disabled', () => {
      /* Act */
      render(
        <Form
          id="login"
          title="Connexion"
          inputs={LOGIN_INPUTS}
          onSubmit={vi.fn()}
          submitLabel={SUBMIT_LABEL}
          loading
        />,
      );

      /* Assert */
      const btn = screen.getByRole('button', { name: `${SUBMIT_LABEL}...` });
      expect(btn).toBeDisabled();
    });
  });

  /* FM.2 validation */
  describe('FM.2 inline validation', () => {
    it('9.2.1 blur on empty email → shows required error', async () => {
      /* Arrange */
      render(
        <Form id="login" title="Connexion" inputs={LOGIN_INPUTS} onSubmit={vi.fn()} submitLabel={SUBMIT_LABEL} />,
      );
      const emailInput = screen.getByLabelText('Email');

      /* Act */
      fireEvent.focus(emailInput);
      fireEvent.blur(emailInput);

      /* Assert */
      await waitFor(() =>
        expect(screen.getByText('Email requis')).toBeInTheDocument(),
      );
    });

    it('9.2.2 blur with invalid email format → shows format error', async () => {
      /* Arrange */
      render(
        <Form id="login" title="Connexion" inputs={LOGIN_INPUTS} onSubmit={vi.fn()} submitLabel={SUBMIT_LABEL} />,
      );
      const emailInput = screen.getByLabelText('Email');

      /* Act */
      await userEvent.type(emailInput, 'not-an-email');
      fireEvent.blur(emailInput);

      /* Assert */
      await waitFor(() =>
        expect(screen.getByText('Format email invalide')).toBeInTheDocument(),
      );
    });

    it('9.2.3 typing after error → clears the error', async () => {
      /* Arrange */
      render(
        <Form id="login" title="Connexion" inputs={LOGIN_INPUTS} onSubmit={vi.fn()} submitLabel={SUBMIT_LABEL} />,
      );
      const emailInput = screen.getByLabelText('Email');
      fireEvent.blur(emailInput); // trigger required error
      await waitFor(() => expect(screen.getByText('Email requis')).toBeInTheDocument());

      /* Act */
      await userEvent.type(emailInput, 'a');

      /* Assert */
      await waitFor(() =>
        expect(screen.queryByText('Email requis')).not.toBeInTheDocument(),
      );
    });
  });

  /* FM.3 submit */
  describe('FM.3 submit', () => {
    it('9.3.1 submit with empty fields → does not call onSubmit', async () => {
      /* Arrange */
      const mockSubmit = vi.fn();
      render(
        <Form id="login" title="Connexion" inputs={LOGIN_INPUTS} onSubmit={mockSubmit} submitLabel={SUBMIT_LABEL} />,
      );

      /* Act */
      await userEvent.click(screen.getByRole('button', { name: SUBMIT_LABEL }));

      /* Assert */
      await waitFor(() => expect(screen.getByText('Email requis')).toBeInTheDocument());
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('9.3.2 submit with valid fields → calls onSubmit with values', async () => {
      /* Arrange */
      const mockSubmit = vi.fn().mockResolvedValue(true);
      render(
        <Form id="login" title="Connexion" inputs={LOGIN_INPUTS} onSubmit={mockSubmit} submitLabel={SUBMIT_LABEL} />,
      );

      /* Act */
      await userEvent.type(screen.getByLabelText('Email'), 'alice@test.com');
      await userEvent.type(screen.getByLabelText('Mot de passe'), 'secret12');
      await userEvent.click(screen.getByRole('button', { name: SUBMIT_LABEL }));

      /* Assert */
      await waitFor(() =>
        expect(mockSubmit).toHaveBeenCalledWith({ email: 'alice@test.com', password: 'secret12' }),
      );
    });
  });
});
