import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../api/fileApi', () => ({
  fileApi: {
    getAll: vi.fn(),
    upload: vi.fn(),
    remove: vi.fn(),
  },
}));

import { fileApi } from '../api/fileApi';
import { fileService } from './fileService';

const mockGetAll = fileApi.getAll as ReturnType<typeof vi.fn>;
const mockUpload = fileApi.upload as ReturnType<typeof vi.fn>;
const mockRemove = fileApi.remove as ReturnType<typeof vi.fn>;

const makeApiOk = (data: unknown) => ({
  data: { status: 'success', message: 'ok', data },
});

const makeFileItem = (overrides = {}) => ({
  id: 1,
  originalName: 'photo.jpg',
  shareToken: 'tok123',
  passwordProtected: false,
  expiresAt: null,
  tags: [],
  ...overrides,
});

beforeEach(() => vi.clearAllMocks());

/* ---------------------------------------------------------------- getMyFiles() */
describe('fileService.getMyFiles()', () => {
  it('F.1 réponse ok → retourne tableau de fichiers', async () => {
    /* Arrange */
    mockGetAll.mockResolvedValueOnce(makeApiOk([makeFileItem()]));

    /* Act */
    const result = await fileService.getMyFiles();

    /* Assert */
    expect(result).toHaveLength(1);
    expect((result as ReturnType<typeof makeFileItem>[])[0].id).toBe(1);
  });

  it('F.2 data null → retourne tableau vide', async () => {
    /* Arrange */
    mockGetAll.mockResolvedValueOnce(makeApiOk(null));

    /* Act */
    const result = await fileService.getMyFiles();

    /* Assert */
    expect(result).toEqual([]);
  });

  it('F.3 erreur réseau → ErrorMsg', async () => {
    /* Arrange */
    mockGetAll.mockRejectedValueOnce({ response: { status: 401 } });

    /* Act */
    const result = await fileService.getMyFiles();

    /* Assert */
    expect(result).toMatchObject({ level: 'error' });
  });
});

/* --------------------------------------------------------------- uploadFile() */
describe('fileService.uploadFile()', () => {
  it('F.4 upload ok → retourne FileItem', async () => {
    /* Arrange */
    const item = makeFileItem();
    mockUpload.mockResolvedValueOnce(makeApiOk(item));
    const fd = new FormData();

    /* Act */
    const result = await fileService.uploadFile(fd);

    /* Assert */
    expect(result).toEqual(item);
  });

  it('F.5 erreur 400 → ErrorMsg', async () => {
    /* Arrange */
    mockUpload.mockRejectedValueOnce({ response: { status: 400 } });

    /* Act */
    const result = await fileService.uploadFile(new FormData());

    /* Assert */
    expect(result).toMatchObject({ level: 'error' });
  });
});

/* -------------------------------------------------------------- deleteFile() */
describe('fileService.deleteFile()', () => {
  it('F.6 delete ok → résout sans valeur', async () => {
    /* Arrange */
    mockRemove.mockResolvedValueOnce({});

    /* Act & Assert */
    await expect(fileService.deleteFile(1)).resolves.toBeUndefined();
    expect(mockRemove).toHaveBeenCalledWith(1);
  });
});
