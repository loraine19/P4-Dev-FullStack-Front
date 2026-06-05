import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { fileService } from '../services/fileService';
import useAuthStore from './authStore';
import { ERROR_MESSAGES } from '../constants/error-messages';
import { isErrorMsg, type ErrorMsg } from '../types/error.types';
import type { FileItemDto, UploadingFile, UploadParams } from '../types/file.types';

/* IFILE STATE */
export interface IFileState {
  files: FileItemDto[];
  isLoading: boolean;
  error: ErrorMsg | null;
  shareToken: string | null;
  uploadingFile: UploadingFile | null;
}

/* IFILE ACTIONS */
export interface IFileActions {
  upload(params: UploadParams): Promise<boolean>;
  loadFiles(): Promise<void>;
  deleteFile(id: number): Promise<boolean>;
  setFiles(files: FileItemDto[]): void;
  addFile(file: FileItemDto): void;
  removeFile(id: number): void;
  setUploadingFile(payload: UploadingFile | null): void;
  clearUploadingFile(): void;
  clearError(): void;
}

/* FILE STORE */
const useFileStore = create<IFileState & IFileActions>((set) => ({
  files: [],
  isLoading: false,
  error: null,
  shareToken: null,
  uploadingFile: null,

  /* UPLOAD */
  upload: async (params) => {
    set({ isLoading: true, error: null, shareToken: null });
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    const result = await fileService.upload(params, isAuthenticated);
    if (isErrorMsg(result)) {
      set({ isLoading: false, error: result });
      return false;
    }
    if (!result) {
      set({
        isLoading: false,
        error: { level: 'error', message: ERROR_MESSAGES.UPLOAD.NO_SHARE_TOKEN },
      });
      return false;
    }
    if (isAuthenticated) {
      set((s) => ({ files: [...s.files, result], isLoading: false }));
      return true;
    }
    if (!result.shareToken) {
      set({
        isLoading: false,
        error: { level: 'error', message: ERROR_MESSAGES.UPLOAD.NO_SHARE_TOKEN },
      });
      return false;
    }
    set({ shareToken: result.shareToken, isLoading: false });
    return true;
  },

  /* LOAD FILES */
  loadFiles: async () => {
    set({ isLoading: true, error: null });
    const result = await fileService.getMyFiles();
    if (isErrorMsg(result)) {
      set({ isLoading: false, error: result });
      return;
    }
    set({ files: result, isLoading: false });
  },

  /* DELETE FILE */
  deleteFile: async (id) => {
    const result = await fileService.deleteFile(id);
    if (isErrorMsg(result)) {
      set({ error: result });
      return false;
    }
    set((s) => ({ files: s.files.filter((f) => f.id !== id) }));
    return true;
  },

  /* SET FILES */
  setFiles: (files) => set({ files }),

  /* ADD FILE */
  addFile: (file) => set((s) => ({ files: [...s.files, file] })),

  /* REMOVE FILE */
  removeFile: (id) => set((s) => ({ files: s.files.filter((f) => f.id !== id) })),

  /* UPLOADING FILE */
  setUploadingFile: (payload) => {
    set({ uploadingFile: payload });
  },

  clearUploadingFile: () => set({ uploadingFile: null }),

  /* CLEAR ERROR */
  clearError: () => set({ error: null }),
}));

/* USE FILE STORE SHALLOW */
export const useFileStoreShallow = <T,>(selector: (s: IFileState & IFileActions) => T) =>
  useFileStore(useShallow(selector));

export default useFileStore;
