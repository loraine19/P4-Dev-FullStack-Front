import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {

  /* BT.1 renders */
  it('6.1.1 renders children text', () => {
    /* Act */
    render(<Button>Click me</Button>);

    /* Assert */
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  /* BT.2 variant class */
  it('6.2.1 applies default variant class btn-primary', () => {
    /* Act */
    render(<Button>Ok</Button>);

    /* Assert */
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });

  it('6.2.2 applies custom variant class', () => {
    /* Act */
    render(<Button variant="dark">Logout</Button>);

    /* Assert */
    expect(screen.getByRole('button')).toHaveClass('btn-dark');
  });

  /* BT.3 disabled */
  it('6.3.1 is disabled when disabled prop passed', () => {
    /* Act */
    render(<Button disabled>Submit</Button>);

    /* Assert */
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
