import { create } from 'zustand';
import { tagService } from '../services/tagService';
import { isErrorMsg, type ErrorMsg } from '../types/error.types';
import type { Tag } from '../types/tag.types';

/* ITAG STATE */
export interface ITagState {
  tags: Tag[];
  isLoading: boolean;
  errorTags: ErrorMsg | null;
}

/* ITAG ACTIONS */
export interface ITagActions {
  loadTags(): Promise<void>;
  addTagByName(name: string): Promise<Tag | null>;
  removeTag(id: number): Promise<void>;
  clearError(): void;
}

/* TAG STORE */
const useTagStore = create<ITagState & ITagActions>((set, get) => ({
  tags: [],
  isLoading: false,
  errorTags: null,

  /* LOAD TAGS */
  loadTags: async () => {
    set({ isLoading: true, errorTags: null });
    const result = await tagService.getAll();
    if (isErrorMsg(result)) {
      set({ errorTags: result, isLoading: false });
      return;
    }
    set({ tags: result, isLoading: false });
  },

  /* ADD TAG BY NAME */
  addTagByName: async (name) => {
    const existing = get().tags.find((t) => t.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing;
    const result = await tagService.create(name);
    if (isErrorMsg(result)) {
      set({ errorTags: result });
      return null;
    }
    set((s) => ({ tags: [...s.tags, result] }));
    return result;
  },

  /* REMOVE TAG */
  removeTag: async(id) => {
    const isRemoved = await tagService.remove(id);
    if (isErrorMsg(isRemoved)) {
      set({ errorTags: isRemoved });
      return;
    }
    
    else{
      const newTags = get().tags.filter((t) => t.id !== id);
    set(() => ({ tags: newTags }));}
  },

  /* CLEAR ERROR */
  clearError: () => set({ errorTags: null }),
}));

export default useTagStore;
