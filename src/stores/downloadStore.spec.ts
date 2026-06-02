import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/downloadService', () => ({
  downloadService: {
    getMeta: vi.fn(),
    download: vi.fn(),
  },
}));

import useDownloadStore from './downloadStore';
import { downloadService } from '../services/downloadService';

const mockGetMeta  = downloadService.getMeta  as ReturnType<typeof vi.fn>;
const mockDownload = downloadService.download as ReturnType<typeof vi.fn>;

const RESET = { meta: null, metaError: null, downloadError: null, isLoading: false };

beforeEach(() => {
  vi.clearAllMocks();
  useDownloadStore.setState(RESET);
});

/* getMeta() */
describe('downloadStore - getMeta()', () => {
  it('DS.1.1 service returns meta → meta set, metaError null', async () => {
    /* Arrange */
    const meta = { filename: 'doc.pdf', size: 1024, mimeType: 'application/pdf', requiresPassword: false };
    mockGetMeta.mockResolvedValueOnce(meta);

    /* Act */
    await useDownloadStore.getState().getMeta('token-abc');

    /* Assert */
    expect(useDownloadStore.getState().meta).toEqual(meta);
    expect(useDownloadStore.getState().metaError).toBeNull();
  });

  it('DS.1.2 service returns ErrorMsg → metaError set, meta null', async () => {
    /* Arrange */
    mockGetMeta.mockResolvedValueOnce({ level: 'error', message: 'Lien expiré' });

    /* Act */
    await useDownloadStore.getState().getMeta('expired-token');

    /* Assert */
    expect(useDownloadStore.getState().metaError).toMatchObject({ level: 'error' });
    expect(useDownloadStore.getState().meta).toBeNull();
  });
});

/* download() */
describe('downloadStore - download()', () => {
  it('DS.2.1 download success → isLoading false, downloadError null', async () => {
    /* Arrange */
    mockDownload.mockResolvedValueOnce(undefined);

    /* Act */
    await useDownloadStore.getState().download('token-abc', 'secret');

    /* Assert */
    expect(useDownloadStore.getState().isLoading).toBe(false);
    expect(useDownloadStore.getState().downloadError).toBeNull();
  });

  it('DS.2.2 service returns ErrorMsg → downloadError set, isLoading false', async () => {
    /* Arrange */
    mockDownload.mockResolvedValueOnce({ level: 'error', message: 'Mot de passe incorrect' });

    /* Act */
    await useDownloadStore.getState().download('token-abc', 'wrong');

    /* Assert */
    expect(useDownloadStore.getState().downloadError).toMatchObject({ level: 'error' });
    expect(useDownloadStore.getState().isLoading).toBe(false);
  });

  it('DS.2.3 isLoading true during download', async () => {
    /* Arrange */
    let loadingDuringCall = false;
    mockDownload.mockImplementationOnce(async () => {
      loadingDuringCall = useDownloadStore.getState().isLoading;
    });

    /* Act */
    await useDownloadStore.getState().download('token-abc');

    /* Assert */
    expect(loadingDuringCall).toBe(true);
    expect(useDownloadStore.getState().isLoading).toBe(false);
  });
});

/* clearErrors() */
describe('downloadStore - clearErrors()', () => {
  it('DS.3.1 clears metaError and downloadError', () => {
    /* Arrange */
    useDownloadStore.setState({
      metaError:     { level: 'error', message: 'err meta' },
      downloadError: { level: 'error', message: 'err dl' },
    });

    /* Act */
    useDownloadStore.getState().clearErrors();

    /* Assert */
    expect(useDownloadStore.getState().metaError).toBeNull();
    expect(useDownloadStore.getState().downloadError).toBeNull();
  });
});
