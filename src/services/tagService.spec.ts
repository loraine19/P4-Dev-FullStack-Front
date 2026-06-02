import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../api/tagApi', () => ({
  tagApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
  },
}));

import { tagApi } from '../api/tagApi';
import { tagService } from './tagService';

const mockGetAll = tagApi.getAll as ReturnType<typeof vi.fn>;
const mockCreate = tagApi.create as ReturnType<typeof vi.fn>;
const mockRemove = tagApi.remove as ReturnType<typeof vi.fn>;

const makeApiOk = (data: unknown) => ({
  data: { status: 'success', message: 'ok', data },
});

beforeEach(() => vi.clearAllMocks());

/* ----------------------------------------------------------------- getAll() */
describe('tagService.getAll()', () => {
  it('T.1 ok response → returns tag array', async () => {
    /* Arrange */
    const tags = [{ id: 1, name: 'react' }, { id: 2, name: 'node' }];
    mockGetAll.mockResolvedValueOnce(makeApiOk(tags));

    /* Act */
    const result = await tagService.getAll();

    /* Assert */
    expect(result).toEqual(tags);
  });

  it('T.2 null data → returns empty array', async () => {
    /* Arrange */
    mockGetAll.mockResolvedValueOnce(makeApiOk(null));

    /* Act */
    const result = await tagService.getAll();

    /* Assert */
    expect(result).toEqual([]);
  });

  it('T.3 network error → ErrorMsg', async () => {
    /* Arrange */
    mockGetAll.mockRejectedValueOnce({ response: { status: 500 } });

    /* Act */
    const result = await tagService.getAll();

    /* Assert */
    expect(result).toMatchObject({ level: 'error' });
  });
});

/* ----------------------------------------------------------------- create() */
describe('tagService.create()', () => {
  it('T.4 create ok → returns Tag', async () => {
    /* Arrange */
    const tag = { id: 3, name: 'typescript' };
    mockCreate.mockResolvedValueOnce(makeApiOk(tag));

    /* Act */
    const result = await tagService.create('typescript');

    /* Assert */
    expect(result).toEqual(tag);
    expect(mockCreate).toHaveBeenCalledWith('typescript');
  });

  it('T.5 duplicate → ErrorMsg 409', async () => {
    /* Arrange */
    mockCreate.mockRejectedValueOnce({ response: { status: 409 } });

    /* Act */
    const result = await tagService.create('react');

    /* Assert */
    expect(result).toMatchObject({ level: 'error' });
  });
});

/* ----------------------------------------------------------------- remove() */
describe('tagService.remove()', () => {
  it('T.6 delete ok → resolves void', async () => {
    /* Arrange */
    mockRemove.mockResolvedValueOnce({});

    /* Act */
    const result = await tagService.remove(1);

    /* Assert */
    expect(result).toBeUndefined();
    expect(mockRemove).toHaveBeenCalledWith(1);
  });

  it('T.7 403 error → ErrorMsg', async () => {
    /* Arrange */
    mockRemove.mockRejectedValueOnce({ response: { status: 403 } });

    /* Act */
    const result = await tagService.remove(99);

    /* Assert */
    expect(result).toMatchObject({ level: 'error' });
  });
});
