import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { downloadService } from '../services/downloadService';
import { isErrorMsg, type ErrorMsg } from '../types/error.types';
import type { DownloadMeta } from '../types/download.types';

/* IDOWNLOAD STATE */
interface IDownloadState {
  meta: DownloadMeta | null;
  metaError: ErrorMsg | null;
  downloadError: ErrorMsg | null;
  isLoading: boolean;
}

/* IDOWNLOAD ACTIONS */
interface IDownloadActions {
  getMeta(shareToken: string): Promise<void>;
  download(shareToken: string, password?: string): Promise<void>;
  clearErrors(): void;
}

/* DOWNLOAD STORE */
const useDownloadStore = create<IDownloadState & IDownloadActions>((set) => ({
  meta: null,
  metaError: null,
  downloadError: null,
  isLoading: false,

  /* GET META */
  getMeta: async (shareToken) => {
    const result = await downloadService.getMeta(shareToken);
    if (isErrorMsg(result)) set({ metaError: result });
    else set({ meta: result });
  },

  /* DOWNLOAD */
  download: async (shareToken, password) => {
    set({ isLoading: true, downloadError: null });
    const result = await downloadService.download(shareToken, password);
    set({ isLoading: false });
    if (isErrorMsg(result)) set({ downloadError: result });
  },

  /* CLEAR ERRORS */
  clearErrors: () => set({ metaError: null, downloadError: null }),
}));

/* USE DOWNLOAD STORE SHALLOW */
export const useDownloadStoreShallow = <T,>(selector: (s: IDownloadState & IDownloadActions) => T) =>
  useDownloadStore(useShallow(selector));

export default useDownloadStore;
