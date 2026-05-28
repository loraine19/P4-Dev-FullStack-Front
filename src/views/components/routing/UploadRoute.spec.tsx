import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UploadRoute from './UploadRoute';
import useAuthStore from '../../../stores/authStore';

const RESET = { user: null, isAuthenticated: false, isLoading: false, error: null };

beforeEach(() => {
  useAuthStore.setState(RESET);
  vi.stubEnv('VITE_ANONYMOUS_UPLOAD', '');
});

describe('UploadRoute', () => {

  /* UR.1.1 authenticated → renders children */
  it('11.1.1 authenticated → renders children', () => {
    /* Arrange */
    useAuthStore.setState({ isAuthenticated: true });

    /* Act */
    render(
      <MemoryRouter>
        <UploadRoute>
          <div>Upload form</div>
        </UploadRoute>
      </MemoryRouter>,
    );

    /* Assert */
    expect(screen.getByText('Upload form')).toBeInTheDocument();
  });

  /* UR.1.2 not authenticated, no anonymous upload → redirects */
  it('11.1.2 not authenticated and anonymous upload disabled → does not render children', () => {
    /* Arrange */
    useAuthStore.setState({ isAuthenticated: false });
    vi.stubEnv('VITE_ANONYMOUS_UPLOAD', 'false');

    /* Act */
    render(
      <MemoryRouter>
        <UploadRoute>
          <div>Upload form</div>
        </UploadRoute>
      </MemoryRouter>,
    );

    /* Assert */
    expect(screen.queryByText('Upload form')).not.toBeInTheDocument();
  });

  /* UR.1.3 anonymous upload enabled → renders children even without auth */
  it('11.1.3 anonymous upload enabled → renders children without auth', () => {
    /* Arrange */
    useAuthStore.setState({ isAuthenticated: false });
    vi.stubEnv('VITE_ANONYMOUS_UPLOAD', 'true');

    /* Act */
    render(
      <MemoryRouter>
        <UploadRoute>
          <div>Upload form</div>
        </UploadRoute>
      </MemoryRouter>,
    );

    /* Assert */
    expect(screen.getByText('Upload form')).toBeInTheDocument();
  });
});
