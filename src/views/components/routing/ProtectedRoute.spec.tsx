import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import useAuthStore from '../../../stores/authStore';

const RESET = { user: null, isAuthenticated: false, isLoading: false, error: null };

beforeEach(() => {
  useAuthStore.setState(RESET);
});

describe('ProtectedRoute', () => {

  /* PR.1.1 authenticated → renders children */
  it('10.1.1 authenticated → renders children', () => {
    /* Arrange */
    useAuthStore.setState({ isAuthenticated: true });

    /* Act */
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    /* Assert */
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  /* PR.1.2 not authenticated → does not render children */
  it('10.1.2 not authenticated → does not render children (redirects)', () => {
    /* Arrange */
    useAuthStore.setState({ isAuthenticated: false });

    /* Act */
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    /* Assert */
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });
});
