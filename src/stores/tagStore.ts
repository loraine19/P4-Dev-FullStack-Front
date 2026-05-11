import { create } from 'zustand';
import type { Tag } from '../types/tag.types';

/* ITAG STATE */
interface ITagState {
  tags: Tag[];
}

/* ITAG ACTIONS */
interface ITagActions {
  setTags(tags: Tag[]): void;
  addTag(tag: Tag): void;
  removeTag(id: number): void;
}

/* TAG STORE */
const useTagStore = create<ITagState & ITagActions>((set) => ({
  tags: [],

  /* SET TAGS */
  setTags: (tags) => set({ tags }),

  /* ADD TAG */
  addTag: (tag) => set((s) => ({ tags: [...s.tags, tag] })),

  /* REMOVE TAG */
  removeTag: (id) => set((s) => ({ tags: s.tags.filter((t) => t.id !== id) })),
}));

export default useTagStore;
