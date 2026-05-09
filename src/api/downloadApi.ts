import apiClient from './apiClient';
import type { DownloadMeta } from '../types/file.types';

/* IDOWNLOAD API INTERFACE */
interface IDownloadApi {
  getMeta(shareToken: string): Promise<import('axios').AxiosResponse<DownloadMeta>>;
  download(shareToken: string, password?: string): Promise<import('axios').AxiosResponse<Blob>>;
}

/* DOWNLOAD API */
class DownloadApi implements IDownloadApi {
  /* GET META */
  getMeta(shareToken: string) {
    return apiClient.get<DownloadMeta>(`/download/${shareToken}`);
  }

  /* DOWNLOAD */
  download(shareToken: string, password?: string) {
    return apiClient.post<Blob>(`/download/${shareToken}`, { password }, { responseType: 'blob' });
  }
}

export const downloadApi = new DownloadApi();
