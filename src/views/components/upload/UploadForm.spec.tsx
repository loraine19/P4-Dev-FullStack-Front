import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

const { mockUpload, mockLoadTags } = vi.hoisted(() => ({
  mockUpload: vi.fn().mockResolvedValue(true),
  mockLoadTags: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../../stores/fileStore', () => {
  const state = {
    upload: mockUpload,
    isLoading: false,
    error: null,
    shareToken: null,
    uploadingFile: null,
    clearUploadingFile: vi.fn(),
  };
  const useFileStore = (selector: (s: typeof state) => unknown) => selector(state);
  useFileStore.getState = () => state;
  return { default: useFileStore };
});

vi.mock('../../../stores/tagStore', () => ({
  default: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      tags: [],
      addTagByName: vi.fn(),
      errorTags: null,
      loadTags: mockLoadTags,
    }),
}));

import UploadForm from './UploadForm';

beforeEach(() => {
  vi.clearAllMocks();
  mockUpload.mockResolvedValue(true);
});

const renderUploadForm = () =>
  render(<MemoryRouter><UploadForm /></MemoryRouter>);

describe('UploadForm', () => {
  it('29.1 renders upload form', async () => {
    /* Arrange / Act */
    renderUploadForm();
    /* Assert */
    await waitFor(() =>
      expect(screen.getByLabelText('Fichier')).toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: 'Générer un lien de partage' })).toBeInTheDocument();
  });

  it('29.2 renders expiration select', async () => {
    /* Arrange / Act */
    renderUploadForm();
    /* Assert */
    await waitFor(() =>
      expect(screen.getByLabelText("Durée d'expiration")).toBeInTheDocument(),
    );
  });

  it('29.3 renders optional file password field', async () => {
    /* Arrange / Act */
    renderUploadForm();
    /* Assert */
    await waitFor(() =>
      expect(screen.getByLabelText('Mot de passe (optionnel)')).toBeInTheDocument(),
    );
  });

  it('29.4 shows error when submitted without file', async () => {
    /* Arrange */
    renderUploadForm();
    await waitFor(() => screen.getByRole('button', { name: 'Générer un lien de partage' }));
    /* Act */
    await userEvent.click(screen.getByRole('button', { name: 'Générer un lien de partage' }));
    /* Assert */
    await waitFor(() =>
      expect(screen.getByText(/Veuillez sélectionner un fichier/)).toBeInTheDocument(),
    );
  });

  it('29.5 shows error when file password too short', async () => {
    /* Arrange */
    renderUploadForm();
    await waitFor(() => screen.getByLabelText('Fichier'));
    const file = new File(['hello'], 'test.txt', { type: 'text/plain' });
    await userEvent.upload(screen.getByLabelText('Fichier'), file);
    await userEvent.type(screen.getByLabelText('Mot de passe (optionnel)'), 'abc');
    /* Act */
    await userEvent.click(screen.getByRole('button', { name: 'Générer un lien de partage' }));
    /* Assert */
    await waitFor(() =>
      expect(screen.getByText(/au moins 6 caractères/)).toBeInTheDocument(),
    );
  });

  it('29.6 calls fileStore.upload when file selected', async () => {
    /* Arrange */
    renderUploadForm();
    await waitFor(() => screen.getByLabelText('Fichier'));
    const file = new File(['hello'], 'test.txt', { type: 'text/plain' });
    /* Act */
    await userEvent.upload(screen.getByLabelText('Fichier'), file);
    await userEvent.click(screen.getByRole('button', { name: 'Générer un lien de partage' }));
    /* Assert */
    await waitFor(() => expect(mockUpload).toHaveBeenCalledOnce());
  });

});
