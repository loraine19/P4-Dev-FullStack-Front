import apiClient from './apiClient';
import type { DownloadMeta } from '../types/download.types';
import type { ApiResponseEnvelope } from '../types/api.types';

/* IDOWNLOAD API INTERFACE */
interface IDownloadApi {
  getMeta(shareToken: string): Promise<import('axios').AxiosResponse<ApiResponseEnvelope<DownloadMeta>>>;
  download(shareToken: string, password?: string): Promise<import('axios').AxiosResponse<Blob>>;
}

/* DOWNLOAD API */
class DownloadApi implements IDownloadApi {
  /* GET META */
  getMeta(shareToken: string) {
    return apiClient.get<ApiResponseEnvelope<DownloadMeta>>(`/download/${shareToken}`);
  }

  /* DOWNLOAD */
  download(shareToken: string, password?: string) {
    // responseType: 'blob' -  Axios parses binary response as Blob instead of trying to JSON.parse it
    return apiClient.post<Blob>(`/download/${shareToken}`, { password }, { responseType: 'blob' });
  }
}

export const downloadApi = new DownloadApi();
