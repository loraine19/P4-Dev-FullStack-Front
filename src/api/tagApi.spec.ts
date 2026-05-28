import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

import apiClient from './apiClient';
import { tagApi } from './tagApi';

const mockGet = apiClient.get as ReturnType<typeof vi.fn>;
const mockPost = apiClient.post as ReturnType<typeof vi.fn>;
const mockDelete = apiClient.delete as ReturnType<typeof vi.fn>;

beforeEach(() => vi.clearAllMocks());

/* ---------------------------------------------------------------- getAll() */
describe('tagApi.getAll()', () => {
  it('16.1 appelle GET /tags', async () => {
    /* Arrange */
    mockGet.mockResolvedValueOnce({ data: { status: 'success', data: [] } });

    /* Act */
    await tagApi.getAll();

    /* Assert */
    expect(mockGet).toHaveBeenCalledWith('/tags');
  });
});

/* --------------------------------------------------------------- create() */
describe('tagApi.create()', () => {
  it('16.2 appelle POST /tags avec { name }', async () => {
    /* Arrange */
    mockPost.mockResolvedValueOnce({ data: { status: 'success', data: {} } });

    /* Act */
    await tagApi.create('backend');

    /* Assert */
    expect(mockPost).toHaveBeenCalledWith('/tags', { name: 'backend' });
  });
});

/* --------------------------------------------------------------- remove() */
describe('tagApi.remove()', () => {
  it('16.3 appelle DELETE /tags/:id', async () => {
    /* Arrange */
    mockDelete.mockResolvedValueOnce({ data: { status: 'success', data: null } });

    /* Act */
    await tagApi.remove(7);

    /* Assert */
    expect(mockDelete).toHaveBeenCalledWith('/tags/7');
  });
});
