import { create } from 'zustand';
import type { FileItem } from '../types/file.types';

/* IUPLOADING FILE */
interface IUploadingFile {
  file: File | null;
  error: string;
  name: string;
}

/* IFILE STATE */
interface IFileState {
  files: FileItem[];
  uploadingFile: IUploadingFile | null;
}

/* IFILE ACTIONS */
interface IFileActions {
  setFiles(files: FileItem[]): void;
  addFile(file: FileItem): void;
  removeFile(id: number): void;
  setUploadingFile(file: IUploadingFile): void;
  clearUploadingFile(): void;
}

/* FILE STORE */
const useFileStore = create<IFileState & IFileActions>((set) => ({
  files: [],
  uploadingFile: null,

  /* SET UPLOADING FILE */
  setUploadingFile: (file) => set({ uploadingFile: file }),
  /* CLEAR UPLOADING FILE */
  clearUploadingFile: () => set({ uploadingFile: null }),
  /* SET FILES */
  setFiles: (files) => set({ files }),

  /* ADD FILE */
  addFile: (file) => set((s) => ({ files: [...s.files, file] })),

  /* REMOVE FILE */
  removeFile: (id) => set((s) => ({ files: s.files.filter((f) => f.id !== id) })),
}));

export default useFileStore;
