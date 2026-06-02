import { describe, it, expect, vi, beforeEach } from 'vitest';
import useTagStore from './tagStore';
import { tagService } from '../services/tagService';

vi.mock('../services/tagService', () => ({
  tagService: {
    getAll: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
  },
}));

const makeTag = (id: number) => ({ id, name: `tag-${id}`, userId: 1 });

const RESET = { tags: [], isLoading: false, errorTags: null };

beforeEach(() => {
  useTagStore.setState(RESET);
  vi.clearAllMocks();
});

/* loadTags */
describe('tagStore — loadTags()', () => {
  it('4.1.1 success → tags loaded', async () => {
    /* Arrange */
    (tagService.getAll as ReturnType<typeof vi.fn>).mockResolvedValue([makeTag(1), makeTag(2)]);
    /* Act */
    await useTagStore.getState().loadTags();
    /* Assert */
    expect(useTagStore.getState().tags).toHaveLength(2);
    expect(useTagStore.getState().isLoading).toBe(false);
  });
});

/* addTagByName */
describe('tagStore — addTagByName()', () => {
  it('4.2.1 existing tag → returns tag without API call', async () => {
    /* Arrange */
    useTagStore.setState({ tags: [makeTag(1)] });
    /* Act */
    const result = await useTagStore.getState().addTagByName('tag-1');
    /* Assert */
    expect(result).toEqual(makeTag(1));
    expect(tagService.create).not.toHaveBeenCalled();
  });

  it('4.2.2 new tag → created and added to list', async () => {
    /* Arrange */
    (tagService.create as ReturnType<typeof vi.fn>).mockResolvedValue(makeTag(2));
    /* Act */
    const result = await useTagStore.getState().addTagByName('tag-2');
    /* Assert */
    expect(result).toEqual(makeTag(2));
    expect(useTagStore.getState().tags).toHaveLength(1);
  });
});

/* removeTag */
describe('tagStore — removeTag()', () => {
  it('4.3.1 delete ok → tag removed from list', async () => {
    /* Arrange */
    useTagStore.setState({ tags: [makeTag(1), makeTag(2), makeTag(3)] });
    (tagService.remove as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    /* Act */
    await useTagStore.getState().removeTag(2);
    /* Assert */
    const ids = useTagStore.getState().tags.map((t) => t.id);
    expect(ids).not.toContain(2);
    expect(ids).toContain(1);
    expect(ids).toContain(3);
  });

  it('4.3.2 API error → errorTags set, list unchanged', async () => {
    /* Arrange */
    useTagStore.setState({ tags: [makeTag(1), makeTag(2)] });
    (tagService.remove as ReturnType<typeof vi.fn>).mockResolvedValue({ message: 'Interdit', level: 'error' });
    /* Act */
    await useTagStore.getState().removeTag(2);
    /* Assert */
    expect(useTagStore.getState().errorTags).not.toBeNull();
    expect(useTagStore.getState().tags).toHaveLength(2);
  });
});
