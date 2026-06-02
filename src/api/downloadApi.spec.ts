import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

import apiClient from './apiClient';
import { downloadApi } from './downloadApi';

const mockGet = apiClient.get as ReturnType<typeof vi.fn>;
const mockPost = apiClient.post as ReturnType<typeof vi.fn>;

beforeEach(() => vi.clearAllMocks());

/* --------------------------------------------------------------- getMeta() */
describe('downloadApi.getMeta()', () => {
  it('17.1 calls GET /download/:shareToken', async () => {
    /* Arrange */
    mockGet.mockResolvedValueOnce({ data: { status: 'success', data: {} } });

    /* Act */
    await downloadApi.getMeta('abc123');

    /* Assert */
    expect(mockGet).toHaveBeenCalledWith('/download/abc123');
  });
});

/* ------------------------------------------------------------- download() */
describe('downloadApi.download()', () => {
  it('17.2 calls POST /download/:shareToken without password', async () => {
    /* Arrange */
    mockPost.mockResolvedValueOnce({ data: new Blob() });

    /* Act */
    await downloadApi.download('abc123');

    /* Assert */
    expect(mockPost).toHaveBeenCalledWith(
      '/download/abc123',
      { password: undefined },
      { responseType: 'blob' },
    );
  });

  it('17.3 calls POST /download/:shareToken with password', async () => {
    /* Arrange */
    mockPost.mockResolvedValueOnce({ data: new Blob() });

    /* Act */
    await downloadApi.download('abc123', 'secret');

    /* Assert */
    expect(mockPost).toHaveBeenCalledWith(
      '/download/abc123',
      { password: 'secret' },
      { responseType: 'blob' },
    );
  });
});
