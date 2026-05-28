import { describe, it, expect, beforeEach } from 'vitest';
import useTagStore from './tagStore';

const makeTag = (id: number) => ({ id, name: `tag-${id}`, userId: 1 });

const RESET = { tags: [] };

beforeEach(() => {
  useTagStore.setState(RESET);
});

/* setTags */
describe('tagStore -  setTags()', () => {
  it('4.1.1 setTags replaces entire list', () => {
    /* Arrange */
    const tags = [makeTag(1), makeTag(2)];

    /* Act */
    useTagStore.getState().setTags(tags);

    /* Assert */
    expect(useTagStore.getState().tags).toHaveLength(2);
    expect(useTagStore.getState().tags[0].id).toBe(1);
  });
});

/* addTag */
describe('tagStore -  addTag()', () => {
  it('4.2.1 addTag appends to existing list', () => {
    /* Arrange */
    useTagStore.setState({ tags: [makeTag(1)] });

    /* Act */
    useTagStore.getState().addTag(makeTag(2));

    /* Assert */
    expect(useTagStore.getState().tags).toHaveLength(2);
    expect(useTagStore.getState().tags[1].name).toBe('tag-2');
  });
});

/* removeTag */
describe('tagStore -  removeTag()', () => {
  it('4.3.1 removeTag removes by id, keeps others', () => {
    /* Arrange */
    useTagStore.setState({ tags: [makeTag(1), makeTag(2), makeTag(3)] });

    /* Act */
    useTagStore.getState().removeTag(2);

    /* Assert */
    const ids = useTagStore.getState().tags.map((t) => t.id);
    expect(ids).not.toContain(2);
    expect(ids).toContain(1);
    expect(ids).toContain(3);
  });
});
