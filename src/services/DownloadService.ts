import { downloadApi } from '../api/downloadApi';
import type { DownloadMeta } from '../types/file.types';

/* IDOWNLOAD SERVICE INTERFACE */
interface IDownloadService {
  getMeta(shareToken: string): Promise<DownloadMeta | null>;
  download(shareToken: string, password?: string): Promise<Blob | null>;
}

/* DOWNLOAD SERVICE */
class DownloadService implements IDownloadService {
  /* GET META */
  async getMeta(shareToken: string): Promise<DownloadMeta | null> {
    const res = await downloadApi.getMeta(shareToken);
    return res.data;
  }

  /* DOWNLOAD */
  async download(shareToken: string, password?: string): Promise<Blob | null> {
    const res = await downloadApi.download(shareToken, password);
    return res.data;
  }
}

export const downloadService = new DownloadService();
