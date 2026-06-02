import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../api/fileApi', () => ({
  fileApi: {
    getAll: vi.fn(),
    upload: vi.fn(),
    uploadAnonymous: vi.fn(),
    remove: vi.fn(),
  },
}));

import { fileApi } from '../api/fileApi';
import { fileService } from './fileService';
import type { FileItemDto } from '../types/file.types';

const mockGetAll = fileApi.getAll as ReturnType<typeof vi.fn>;
const mockUpload = fileApi.upload as ReturnType<typeof vi.fn>;
const mockRemove = fileApi.remove as ReturnType<typeof vi.fn>;

const makeApiOk = (data: unknown) => ({
  data: { status: 'success', message: 'ok', data },
});

const makeFileItem  = (overrides : Partial<FileItemDto> = {}) : FileItemDto => ({
  id: 1,
  originalName: 'photo.jpg',
  shareToken: 'tok123',
  passwordProtected: false,
  expiresAt: new Date().toISOString(),
  tags: [],
  size: 1024,
  mimeType: 'image/jpeg',
  createdAt: new Date().toISOString(),
  ...overrides,
});

const makeUploadParams = () => ({
  file: new File(['x'], 'photo.jpg', { type: 'image/jpeg' }),
  expirationDays: 7,
});

beforeEach(() => vi.clearAllMocks());

/* ---------------------------------------------------------------- getMyFiles() */
describe('fileService.getMyFiles()', () => {
  it('F.1 ok response → returns file array', async () => {
    /* Arrange */
    mockGetAll.mockResolvedValueOnce(makeApiOk([makeFileItem()]));

    /* Act */
    const result = await fileService.getMyFiles();

    /* Assert */
    expect(result).toHaveLength(1);
    expect((result as ReturnType<typeof makeFileItem>[])[0].id).toBe(1);
  });

  it('F.2 null data → returns empty array', async () => {
    /* Arrange */
    mockGetAll.mockResolvedValueOnce(makeApiOk(null));

    /* Act */
    const result = await fileService.getMyFiles();

    /* Assert */
    expect(result).toEqual([]);
  });

  it('F.3 network error → ErrorMsg', async () => {
    /* Arrange */
    mockGetAll.mockRejectedValueOnce({ response: { status: 401 } });

    /* Act */
    const result = await fileService.getMyFiles();

    /* Assert */
    expect(result).toMatchObject({ level: 'error' });
  });
});

/* --------------------------------------------------------------- upload() */
describe('fileService.upload()', () => {
  it('F.4 authenticated upload ok → returns FileItem', async () => {
    /* Arrange */
    const item = makeFileItem();
    mockUpload.mockResolvedValueOnce(makeApiOk(item));

    /* Act */
    const result = await fileService.upload(makeUploadParams(), true);

    /* Assert */
    expect(result).toEqual(item);
    expect(mockUpload).toHaveBeenCalledOnce();
  });

  it('F.5 400 error → ErrorMsg', async () => {
    /* Arrange */
    mockUpload.mockRejectedValueOnce({ response: { status: 400 } });

    /* Act */
    const result = await fileService.upload(makeUploadParams(), true);

    /* Assert */
    expect(result).toMatchObject({ level: 'error' });
  });
});

/* -------------------------------------------------------------- deleteFile() */
describe('fileService.deleteFile()', () => {
  it('F.6 delete ok → resolves void', async () => {
    /* Arrange */
    mockRemove.mockResolvedValueOnce({});

    /* Act & Assert */
    await expect(fileService.deleteFile(1)).resolves.toBeUndefined();
    expect(mockRemove).toHaveBeenCalledWith(1);
  });
});
