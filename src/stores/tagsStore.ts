import { create } from 'zustand';
import type { Tag } from '../types/tag.types';

/* ITAGS STATE */
interface ITagsState {
  tags: Tag[];
}

/* ITAGS ACTIONS */
interface ITagsActions {
  setTags(tags: Tag[]): void;
  addTag(tag: Tag): void;
  removeTag(id: number): void;
}

/* TAGS STORE */
const useTagsStore = create<ITagsState & ITagsActions>((set) => ({
  tags: [],

  /* SET TAGS */
  setTags: (tags) => set({ tags }),

  /* ADD TAG */
  addTag: (tag) => set((s) => ({ tags: [...s.tags, tag] })),

  /* REMOVE TAG */
  removeTag: (id) => set((s) => ({ tags: s.tags.filter((t) => t.id !== id) })),
}));

export default useTagsStore;
