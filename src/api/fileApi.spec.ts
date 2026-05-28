import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

import apiClient from './apiClient';
import { fileApi } from './fileApi';

const mockGet = apiClient.get as ReturnType<typeof vi.fn>;
const mockPost = apiClient.post as ReturnType<typeof vi.fn>;
const mockDelete = apiClient.delete as ReturnType<typeof vi.fn>;

beforeEach(() => vi.clearAllMocks());

/* ---------------------------------------------------------------- getAll() */
describe('fileApi.getAll()', () => {
  it('15.1 appelle GET /files', async () => {
    /* Arrange */
    mockGet.mockResolvedValueOnce({ data: { status: 'success', data: [] } });

    /* Act */
    await fileApi.getAll();

    /* Assert */
    expect(mockGet).toHaveBeenCalledWith('/files');
  });
});

/* --------------------------------------------------------------- upload() */
describe('fileApi.upload()', () => {
  it('15.2 appelle POST /files avec multipart/form-data', async () => {
    /* Arrange */
    const formData = new FormData();
    mockPost.mockResolvedValueOnce({ data: { status: 'success', data: {} } });

    /* Act */
    await fileApi.upload(formData);

    /* Assert */
    expect(mockPost).toHaveBeenCalledWith('/files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  });
});

/* --------------------------------------------------------------- remove() */
describe('fileApi.remove()', () => {
  it('15.3 appelle DELETE /files/:id', async () => {
    /* Arrange */
    mockDelete.mockResolvedValueOnce({ data: { status: 'success', data: null } });

    /* Act */
    await fileApi.remove(42);

    /* Assert */
    expect(mockDelete).toHaveBeenCalledWith('/files/42');
  });
});
