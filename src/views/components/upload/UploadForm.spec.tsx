import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

/* Mocks before imports */
vi.mock('../../../services/fileService', () => ({
  fileService: { uploadFile: vi.fn(), uploadFileAnonymous: vi.fn(), getMyFiles: vi.fn() },
}));
vi.mock('../../../services/tagService', () => ({
  tagService: { getAll: vi.fn(), create: vi.fn() },
}));
vi.mock('../../../stores/fileStore', () => ({
  default: vi.fn(() => vi.fn()),
}));
vi.mock('../../../stores/authStore', () => ({
  default: vi.fn((selector: (s: { isAuthenticated: boolean }) => unknown) =>
    selector({ isAuthenticated: true }),
  ),
}));

import UploadForm from './UploadForm';
import { fileService } from '../../../services/fileService';
import { tagService } from '../../../services/tagService';
import useFileStore from '../../../stores/fileStore';

const mockUpload = fileService.uploadFile as ReturnType<typeof vi.fn>;
const mockGetAll = tagService.getAll as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  mockGetAll.mockResolvedValue([]);
  (useFileStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(vi.fn());
});

const renderUploadForm = () =>
  render(<MemoryRouter><UploadForm /></MemoryRouter>);

describe('UploadForm', () => {
  it('29.1 affiche le formulaire d\'upload', async () => {
    /* Arrange / Act */
    renderUploadForm();

    /* Assert */
    await waitFor(() =>
      expect(screen.getByLabelText('Fichier')).toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: 'Générer un lien de partage' })).toBeInTheDocument();
  });

  it('29.2 affiche le select d\'expiration', async () => {
    /* Arrange / Act */
    renderUploadForm();

    /* Assert */
    await waitFor(() =>
      expect(screen.getByLabelText("Durée d'expiration")).toBeInTheDocument(),
    );
  });

  it('29.3 affiche le champ mot de passe optionnel', async () => {
    /* Arrange / Act */
    renderUploadForm();

    /* Assert */
    await waitFor(() =>
      expect(screen.getByLabelText('Mot de passe (optionnel)')).toBeInTheDocument(),
    );
  });

  it('29.4 affiche une erreur si soumis sans fichier', async () => {
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

  it('29.5 appelle fileService.uploadFile avec FormData si fichier sélectionné', async () => {
    /* Arrange */
    mockUpload.mockResolvedValueOnce({ id: 1, originalName: 'test.txt', shareToken: 'tok', expiresAt: new Date().toISOString(), passwordProtected: false, tags: [], size: 10 });
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
