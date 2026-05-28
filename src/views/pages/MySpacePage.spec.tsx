import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../services/fileService', () => ({
  fileService: { getMyFiles: vi.fn(), deleteFile: vi.fn() },
}));
vi.mock('@project-lary/react-material-symbols', () => ({
  Description: () => null,
  Lock: () => null,
  MoreVert: () => null,
}));

import MySpacePage from './MySpacePage';
import { fileService } from '../../services/fileService';
import useFileStore from '../../stores/fileStore';
import useAuthStore from '../../stores/authStore';

const mockGetMyFiles = fileService.getMyFiles as ReturnType<typeof vi.fn>;
const mockDeleteFile = fileService.deleteFile as ReturnType<typeof vi.fn>;

const FUTURE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

const makeFile = (id: number, name: string, overrides = {}) => ({
  id,
  originalName: name,
  shareToken: `tok${id}`,
  expiresAt: FUTURE,
  passwordProtected: false,
  tags: [],
  size: 512,
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  useFileStore.setState({ files: [], addFile: vi.fn(), setFiles: vi.fn(), removeFile: vi.fn() });
  useAuthStore.setState({ logout: vi.fn() } as any);
});

const renderMySpace = () =>
  render(<MemoryRouter><MySpacePage /></MemoryRouter>);

describe('MySpacePage', () => {
  it('30.1 affiche la liste des fichiers chargés', async () => {
    /* Arrange */
    const files = [makeFile(1, 'rapport.pdf'), makeFile(2, 'photo.png')];
    mockGetMyFiles.mockResolvedValueOnce(files);
    useFileStore.setState({ files, setFiles: (f: typeof files) => useFileStore.setState({ files: f }), removeFile: vi.fn(), addFile: vi.fn() });

    /* Act */
    renderMySpace();

    /* Assert */
    await waitFor(() => expect(screen.getByText('rapport.pdf')).toBeInTheDocument());
    expect(screen.getByText('photo.png')).toBeInTheDocument();
  });

  it('30.2 affiche les onglets de filtre', async () => {
    /* Arrange */
    mockGetMyFiles.mockResolvedValueOnce([]);

    /* Act */
    renderMySpace();

    /* Assert */
    expect(screen.getByText('Tous')).toBeInTheDocument();
    expect(screen.getByText('Actifs')).toBeInTheDocument();
    expect(screen.getByText('Expiré')).toBeInTheDocument();
  });

  it('30.3 affiche un message quand aucun fichier', async () => {
    /* Arrange */
    mockGetMyFiles.mockResolvedValueOnce([]);
    useFileStore.setState({ files: [], setFiles: vi.fn(), removeFile: vi.fn(), addFile: vi.fn() });

    /* Act */
    renderMySpace();

    /* Assert */
    await waitFor(() =>
      expect(screen.getByText(/Aucun fichier/)).toBeInTheDocument(),
    );
  });

  it('30.4 ouvre la sidebar au clic sur le burger', async () => {
    /* Arrange */
    mockGetMyFiles.mockResolvedValueOnce([]);
    renderMySpace();

    /* Act */
    await userEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu latéral' }));

    /* Assert */
    expect(screen.getByRole('complementary')).toHaveClass('is-open');
  });

  it('30.5 filtre les fichiers actifs', async () => {
    /* Arrange */
    const PAST = new Date(Date.now() - 86400000).toISOString();
    const files = [makeFile(1, 'actif.txt'), makeFile(2, 'expire.txt', { expiresAt: PAST })];
    mockGetMyFiles.mockResolvedValueOnce(files);
    useFileStore.setState({ files, setFiles: vi.fn(), removeFile: vi.fn(), addFile: vi.fn() });
    renderMySpace();

    /* Act */
    await userEvent.click(screen.getByText('Actifs'));

    /* Assert */
    expect(screen.getByText('actif.txt')).toBeInTheDocument();
    expect(screen.queryByText('expire.txt')).not.toBeInTheDocument();
  });
});
