import { describe, it, expect, vi, beforeEach } from 'vitest';
import useFileStore from './fileStore';
import { fileService } from '../services/fileService';
import { isErrorMsg } from '../types/error.types';

vi.mock('../services/fileService', () => ({
  fileService: {
    getMyFiles: vi.fn(),
    upload: vi.fn(),
    deleteFile: vi.fn(),
  },
}));

vi.mock('./authStore', () => ({
  default: { getState: vi.fn(() => ({ isAuthenticated: true })) },
}));

const makeFile = (id: number) => ({
  id,
  originalName: `file-${id}.txt`,
  size: 1024,
  mimeType: 'text/plain',
  shareToken: `tok-${id}`,
  passwordProtected: false,
  expiresAt: new Date(Date.now() + 7 * 86_400_000).toISOString(),
  createdAt: new Date().toISOString(),
  tags: [],
});

const makeError = () => ({ message: 'Erreur réseau', level: 'error' as const });

const RESET = { files: [], isLoading: false, error: null, shareToken: null, uploadingFile: null };

beforeEach(() => {
  useFileStore.setState(RESET);
  vi.clearAllMocks();
});

/* setFiles */
describe('fileStore — setFiles()', () => {
  it('3.1.1 setFiles replaces entire list', () => {
    /* Arrange */
    const files = [makeFile(1), makeFile(2)];
    /* Act */
    useFileStore.getState().setFiles(files);
    /* Assert */
    expect(useFileStore.getState().files).toHaveLength(2);
    expect(useFileStore.getState().files[0].id).toBe(1);
  });
});

/* addFile */
describe('fileStore — addFile()', () => {
  it('3.2.1 addFile appends to list', () => {
    /* Arrange */
    useFileStore.setState({ files: [makeFile(1)] });
    /* Act */
    useFileStore.getState().addFile(makeFile(2));
    /* Assert */
    expect(useFileStore.getState().files).toHaveLength(2);
    expect(useFileStore.getState().files[1].id).toBe(2);
  });
});

/* removeFile */
describe('fileStore — removeFile()', () => {
  it('3.3.1 removeFile removes by id, keeps others', () => {
    /* Arrange */
    useFileStore.setState({ files: [makeFile(1), makeFile(2), makeFile(3)] });
    /* Act */
    useFileStore.getState().removeFile(2);
    /* Assert */
    const ids = useFileStore.getState().files.map((f) => f.id);
    expect(ids).not.toContain(2);
    expect(ids).toContain(1);
    expect(ids).toContain(3);
  });
});

/* uploadingFile */
describe('fileStore — uploadingFile', () => {
  it('3.6.1 setUploadingFile → state updated', () => {
    /* Arrange */
    const blob = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
    /* Act */
    useFileStore.getState().setUploadingFile({ file: blob, name: 'doc.pdf', error: '' });
    /* Assert */
    expect(useFileStore.getState().uploadingFile?.file).toBe(blob);
    expect(useFileStore.getState().uploadingFile?.name).toBe('doc.pdf');
  });

  it('3.6.2 clearUploadingFile → uploadingFile null', () => {
    /* Arrange */
    useFileStore.setState({
      uploadingFile: { file: new File(['x'], 'a.txt'), name: 'a.txt', error: '' },
    });
    /* Act */
    useFileStore.getState().clearUploadingFile();
    /* Assert */
    expect(useFileStore.getState().uploadingFile).toBeNull();
  });
});

/* loadFiles */
describe('fileStore — loadFiles()', () => {
  it('3.4.1 success → files loaded, isLoading false', async () => {
    /* Arrange */
    const files = [makeFile(1), makeFile(2)];
    (fileService.getMyFiles as ReturnType<typeof vi.fn>).mockResolvedValue(files);
    /* Act */
    await useFileStore.getState().loadFiles();
    /* Assert */
    expect(useFileStore.getState().files).toHaveLength(2);
    expect(useFileStore.getState().isLoading).toBe(false);
    expect(useFileStore.getState().error).toBeNull();
  });

  it('3.4.2 error → store.error set, files unchanged', async () => {
    /* Arrange */
    (fileService.getMyFiles as ReturnType<typeof vi.fn>).mockResolvedValue(makeError());
    /* Act */
    await useFileStore.getState().loadFiles();
    /* Assert */
    expect(isErrorMsg(useFileStore.getState().error)).toBe(true);
    expect(useFileStore.getState().files).toHaveLength(0);
  });
});

/* deleteFile */
describe('fileStore — deleteFile()', () => {
  it('3.5.1 success → file removed from list, returns true', async () => {
    /* Arrange */
    useFileStore.setState({ files: [makeFile(1), makeFile(2)] });
    (fileService.deleteFile as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    /* Act */
    const result = await useFileStore.getState().deleteFile(1);
    /* Assert */
    expect(result).toBe(true);
    expect(useFileStore.getState().files.map((f) => f.id)).not.toContain(1);
    expect(useFileStore.getState().files).toHaveLength(1);
  });

  it('3.5.2 error → store.error set, list unchanged, returns false', async () => {
    /* Arrange */
    useFileStore.setState({ files: [makeFile(1)] });
    (fileService.deleteFile as ReturnType<typeof vi.fn>).mockResolvedValue(makeError());
    /* Act */
    const result = await useFileStore.getState().deleteFile(1);
    /* Assert */
    expect(result).toBe(false);
    expect(isErrorMsg(useFileStore.getState().error)).toBe(true);
    expect(useFileStore.getState().files).toHaveLength(1);
  });
});
