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
      return res.data.data as DownloadMeta;
    } catch (error) {
      return catchApiError(error);
    }
  }

  /* DOWNLOAD */
  async download(shareToken: string, password?: string): Promise<void | ErrorMsg> {
    try {
      const res = await downloadApi.download(shareToken, password);
      // POST response body = raw binary file bytes (not JSON)
      const blob = new Blob([res.data], { type: res.headers['content-type'] as string });
      // browser allocates RAM for the bytes, returns a temporary local URL "blob:http://..."
      const url = URL.createObjectURL(blob);
      // Content-Disposition set by back, exposed to JS via CORS exposedHeaders
      const disposition: string = (res.headers['content-disposition'] as string) ?? '';
      // extract filename from: attachment; filename*=UTF-8''mon%20fichier.pdf
      const match = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^;"'\n]+)/i);
      const filename = match?.[1] ?? 'fichier';
      // invisible <a> — never appended to DOM
      const a = document.createElement('a');
      a.href = url;
      // native HTML attr: forces download instead of navigation, sets the saved filename
      a.download = decodeURIComponent(filename);
      a.click();
      // free browser RAM immediately after triggering the download
      URL.revokeObjectURL(url);
    } catch (error) {
      return catchApiError(error);
    }
  }
}

export const downloadService = new DownloadService();
