import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import InputField from './InputField';

describe('InputField', () => {

  /* IF.1 basic render */
  it('8.1.1 renders label and input', () => {
    /* Act */
    render(<InputField id="email" label="Email" />);

    /* Assert */
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  /* IF.2 error */
  it('8.2.1 renders error message when error prop provided', () => {
    /* Act */
    render(<InputField id="email" label="Email" error="Email requis" />);

    /* Assert */
    expect(screen.getByRole('alert')).toHaveTextContent('Email requis');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  /* IF.3 helperText */
  it('8.3.1 renders helper text when helperText prop provided', () => {
    /* Act */
    render(<InputField id="email" label="Email" helperText="Votre adresse e-mail" />);

    /* Assert */
    expect(screen.getByText('Votre adresse e-mail')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
  });

  /* IF.4 no error and no helperText */
  it('8.4.1 aria-describedby is absent when no error or helperText', () => {
    /* Act */
    render(<InputField id="email" label="Email" />);

    /* Assert */
    const input = screen.getByRole('textbox');
    expect(input).not.toHaveAttribute('aria-describedby');
  });
});
