import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../services/downloadService', () => ({
  downloadService: {
    getMeta: vi.fn(),
    download: vi.fn(),
  },
}));

import DownloadForm from './DownloadForm';
import { downloadService } from '../../../services/downloadService';

const mockGetMeta = downloadService.getMeta as ReturnType<typeof vi.fn>;
const mockDownload = downloadService.download as ReturnType<typeof vi.fn>;

beforeEach(() => vi.clearAllMocks());

describe('DownloadForm', () => {
  it('28.1 shows error callout when getMeta fails', async () => {
    /* Arrange */
    mockGetMeta.mockResolvedValueOnce({ level: 'error', message: 'Lien invalide ou expiré' });

    /* Act */
    render(<MemoryRouter><DownloadForm shareToken="bad-token" /></MemoryRouter>);

    /* Assert */
    await waitFor(() =>
      expect(screen.getByText('Lien invalide ou expiré')).toBeInTheDocument(),
    );
  });

  it('28.2 shows filename and Download if getMeta succeeds', async () => {
    /* Arrange */
    mockGetMeta.mockResolvedValueOnce({
      filename: 'rapport.pdf',
      size: 2048,
      requiresPassword: false,
    });

    /* Act */
    render(<MemoryRouter><DownloadForm shareToken="abc123" /></MemoryRouter>);

    /* Assert */
    await waitFor(() => expect(screen.getByText(/rapport\.pdf/)).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /Télécharger/ })).toBeInTheDocument();
  });

  it('28.3 shows password field when requiresPassword=true', async () => {
    /* Arrange */
    mockGetMeta.mockResolvedValueOnce({
      filename: 'secret.pdf',
      size: 1024,
      requiresPassword: true,
    });

    /* Act */
    render(<MemoryRouter><DownloadForm shareToken="abc123" /></MemoryRouter>);

    /* Assert */
    await waitFor(() => expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument());
  });

  it('28.4 calls downloadService.download on submit', async () => {
    /* Arrange */
    mockGetMeta.mockResolvedValueOnce({
      filename: 'rapport.pdf',
      size: 512,
      requiresPassword: false,
    });
    mockDownload.mockResolvedValueOnce(null);
    render(<MemoryRouter><DownloadForm shareToken="abc123" /></MemoryRouter>);
    await waitFor(() => screen.getByRole('button', { name: /Télécharger/ }));

    /* Act */
    await userEvent.click(screen.getByRole('button', { name: /Télécharger/ }));

    /* Assert */
    await waitFor(() =>
      expect(mockDownload).toHaveBeenCalledWith('abc123', undefined),
    );
  });
});
