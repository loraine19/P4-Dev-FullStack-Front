import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../services/fileService', () => ({
  fileService: { getMyFiles: vi.fn(), deleteFile: vi.fn() },
}));
import MySpacePage from './MySpacePage';
import { fileService } from '../../services/fileService';
import useFileStore from '../../stores/fileStore';
import useAuthStore from '../../stores/authStore';
import type { FileItemDto } from '../../types/file.types';

const mockGetMyFiles = fileService.getMyFiles as ReturnType<typeof vi.fn>;

const FUTURE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

const makeFile = (id: number, name: string, overrides = {}) => ({
  id,
  originalName: name,
  shareToken: `tok${id}`,
  expiresAt: FUTURE,
  passwordProtected: false,
  tags: [],
  size: 512,
  mimeType: 'text/plain',
  createdAt: new Date().toISOString(),
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
  it('30.1 renders loaded file list', async () => {
    /* Arrange */
    const file1: FileItemDto = makeFile(1, 'rapport.pdf', { mimeType: 'application/pdf' });
    const file2 : FileItemDto = makeFile(2, 'photo.png', { mimeType: 'image/png' });
    const files: FileItemDto[] = [
      file1,
      file2,
    ];
    mockGetMyFiles.mockResolvedValueOnce(files);
    useFileStore.setState({ files, setFiles: (f: typeof files) => useFileStore.setState({ files: f }), removeFile: vi.fn(), addFile: vi.fn() });

    /* Act */
    renderMySpace();

    /* Assert */
    await waitFor(() => expect(screen.getByText('rapport.pdf')).toBeInTheDocument());
    expect(screen.getByText('photo.png')).toBeInTheDocument();
  });

  it('30.2 renders filter tabs', async () => {
    /* Arrange */
    mockGetMyFiles.mockResolvedValueOnce([]);

    /* Act */
    renderMySpace();

    /* Assert */
    expect(screen.getByText('Tous')).toBeInTheDocument();
    expect(screen.getByText('Actifs')).toBeInTheDocument();
    expect(screen.getByText('Expiré')).toBeInTheDocument();
  });

  it('30.3 shows message when no files', async () => {
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

  it('30.4 opens sidebar on burger click', async () => {
    /* Arrange */
    mockGetMyFiles.mockResolvedValueOnce([]);
    renderMySpace();

    /* Act */
    await userEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu latéral' }));

    /* Assert */
    expect(screen.getByRole('complementary')).toHaveClass('is-open');
  });

  it('30.5 filters active files', async () => {
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
