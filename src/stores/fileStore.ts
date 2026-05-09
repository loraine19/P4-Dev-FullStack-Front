import { create } from 'zustand';
import type { FileItem } from '../types/file.types';

/* IFILE STATE */
interface IFileState {
  files: FileItem[];
}

/* IFILE ACTIONS */
interface IFileActions {
  setFiles(files: FileItem[]): void;
  addFile(file: FileItem): void;
  removeFile(id: number): void;
}

/* FILE STORE */
const useFileStore = create<IFileState & IFileActions>((set) => ({
  files: [],

  /* SET FILES */
  setFiles: (files) => set({ files }),

  /* ADD FILE */
  addFile: (file) => set((s) => ({ files: [...s.files, file] })),

  /* REMOVE FILE */
  removeFile: (id) => set((s) => ({ files: s.files.filter((f) => f.id !== id) })),
}));

export default useFileStore;
