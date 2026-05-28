import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../services/fileService', () => ({
  fileService: { uploadFile: vi.fn(), getMyFiles: vi.fn() },
}));
vi.mock('../../services/tagService', () => ({
  tagService: { getAll: vi.fn(), create: vi.fn() },
}));
vi.mock('../../stores/fileStore', () => ({
  default: vi.fn(() => vi.fn()),
}));

import UploadPage from './UploadPage';
import { tagService } from '../../services/tagService';
import useFileStore from '../../stores/fileStore';

const mockGetAll = tagService.getAll as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  mockGetAll.mockResolvedValue([]);
  (useFileStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(vi.fn());
});

describe('UploadPage', () => {
  it('32.1 affiche le formulaire d\'upload', async () => {
    /* Arrange / Act */
    render(<MemoryRouter><UploadPage /></MemoryRouter>);

    /* Assert */
    await waitFor(() =>
      expect(screen.getByLabelText('Fichier')).toBeInTheDocument(),
    );
  });

  it('32.2 affiche le bouton Générer un lien de partage', async () => {
    /* Arrange / Act */
    render(<MemoryRouter><UploadPage /></MemoryRouter>);

    /* Assert */
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Générer un lien de partage' })).toBeInTheDocument(),
    );
  });
});
