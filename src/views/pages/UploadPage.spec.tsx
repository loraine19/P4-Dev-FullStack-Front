import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const { mockUpload, mockLoadTags } = vi.hoisted(() => ({
  mockUpload: vi.fn().mockResolvedValue(true),
  mockLoadTags: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../stores/fileStore', () => {
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

vi.mock('../../stores/tagStore', () => ({
  default: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      tags: [],
      addTagByName: vi.fn(),
      errorTags: null,
      loadTags: mockLoadTags,
    }),
}));

import UploadPage from './UploadPage';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('UploadPage', () => {
  it('32.1 renders upload form', async () => {
    /* Arrange / Act */
    render(<MemoryRouter><UploadPage /></MemoryRouter>);
    /* Assert */
    await waitFor(() =>
      expect(screen.getByLabelText('Fichier')).toBeInTheDocument(),
    );
  });

  it('32.2 renders Generate share link button', async () => {
    /* Arrange / Act */
    render(<MemoryRouter><UploadPage /></MemoryRouter>);
    /* Assert */
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Générer un lien de partage' })).toBeInTheDocument(),
    );
  });
});
