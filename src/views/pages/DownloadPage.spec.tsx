import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../../services/downloadService', () => ({
  downloadService: { getMeta: vi.fn(), download: vi.fn() },
}));

import DownloadPage from './DownloadPage';
import { downloadService } from '../../services/downloadService';

const mockGetMeta = downloadService.getMeta as ReturnType<typeof vi.fn>;

beforeEach(() => vi.clearAllMocks());

describe('DownloadPage', () => {
  it('31.1 affiche le titre Lien de téléchargement', async () => {
    /* Arrange */
    mockGetMeta.mockResolvedValueOnce({ level: 'error', message: 'Expiré' });

    /* Act */
    render(
      <MemoryRouter initialEntries={['/download/tok123']}>
        <Routes>
          <Route path="/download/:shareToken" element={<DownloadPage />} />
        </Routes>
      </MemoryRouter>,
    );

    /* Assert */
    expect(screen.getByRole('heading', { name: 'Lien de téléchargement' })).toBeInTheDocument();
  });

  it('31.2 passe le shareToken au DownloadForm', async () => {
    /* Arrange */
    mockGetMeta.mockResolvedValueOnce({
      filename: 'rapport.pdf',
      size: 1024,
      requiresPassword: false,
    });

    /* Act */
    render(
      <MemoryRouter initialEntries={['/download/tok-abc']}>
        <Routes>
          <Route path="/download/:shareToken" element={<DownloadPage />} />
        </Routes>
      </MemoryRouter>,
    );

    /* Assert */
    await waitFor(() => expect(mockGetMeta).toHaveBeenCalledWith('tok-abc'));
  });
});
