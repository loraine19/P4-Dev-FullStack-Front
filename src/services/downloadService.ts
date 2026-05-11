import { downloadApi } from '../api/downloadApi';
import type { DownloadMeta } from '../types/file.types';
import type { ErrorMsg } from '../types/error.types';
import { catchApiError } from './serviceHelpers';

/* IDOWNLOAD SERVICE INTERFACE */
interface IDownloadService {
  getMeta(shareToken: string): Promise<DownloadMeta | ErrorMsg>;
  download(shareToken: string, password?: string): Promise<void | ErrorMsg>;
}

/* DOWNLOAD SERVICE */
class DownloadService implements IDownloadService {
  /* GET META */
  async getMeta(shareToken: string): Promise<DownloadMeta | ErrorMsg> {
    try {
      const res = await downloadApi.getMeta(shareToken);
      return res.data;
    } catch (error) {
      return catchApiError(error);
    }
  }

  /* DOWNLOAD */
  async download(shareToken: string, password?: string): Promise<void | ErrorMsg> {
    try {
      const res = await downloadApi.download(shareToken, password);
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const url = URL.createObjectURL(blob);
      const disposition: string = res.headers['content-disposition'] ?? '';
      const match = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^;"'\n]+)/i);
      const filename = match?.[1] ?? 'fichier';
      const a = document.createElement('a');
      a.href = url;
      a.download = decodeURIComponent(filename);
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      return catchApiError(error);
    }
  }
}

export const downloadService = new DownloadService();
