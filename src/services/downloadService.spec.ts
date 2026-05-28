import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../api/downloadApi', () => ({
  downloadApi: {
    getMeta: vi.fn(),
    download: vi.fn(),
  },
}));

import { downloadApi } from '../api/downloadApi';
import { downloadService } from './downloadService';

const mockGetMeta = downloadApi.getMeta as ReturnType<typeof vi.fn>;
const mockDownload = downloadApi.download as ReturnType<typeof vi.fn>;

const makeApiOk = (data: unknown) => ({
  data: { status: 'success', message: 'ok', data },
});

beforeEach(() => vi.clearAllMocks());

/* --------------------------------------------------------------- getMeta() */
describe('downloadService.getMeta()', () => {
  it('D.1 token valide → retourne DownloadMeta', async () => {
    /* Arrange */
    const meta = { originalName: 'photo.jpg', requiresPassword: false, expiresAt: null };
    mockGetMeta.mockResolvedValueOnce(makeApiOk(meta));

    /* Act */
    const result = await downloadService.getMeta('tok-abc');

    /* Assert */
    expect(result).toEqual(meta);
  });

  it('D.2 token invalide → ErrorMsg', async () => {
    /* Arrange */
    mockGetMeta.mockRejectedValueOnce({ response: { status: 404 } });

    /* Act */
    const result = await downloadService.getMeta('invalid');

    /* Assert */
    expect(result).toMatchObject({ level: 'error' });
  });

  it('D.3 erreur réseau générique → ErrorMsg', async () => {
    /* Arrange */
    mockGetMeta.mockRejectedValueOnce(new Error('Network'));

    /* Act */
    const result = await downloadService.getMeta('tok');

    /* Assert */
    expect(result).toMatchObject({ level: 'error' });
  });
});

/* -------------------------------------------------------------- download() */
describe('downloadService.download()', () => {
  it('D.4 download ok → crée un <a> et le clique', async () => {
    /* Arrange */
    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:mock');
    const mockRevokeObjectURL = vi.fn();
    const mockClick = vi.fn();
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;
    const mockAnchor = { href: '', download: '', click: mockClick };
    vi.spyOn(document, 'createElement').mockReturnValueOnce(mockAnchor as unknown as HTMLElement);
    mockDownload.mockResolvedValueOnce({
      data: new ArrayBuffer(8),
      headers: {
        'content-type': 'image/jpeg',
        'content-disposition': "attachment; filename*=UTF-8''photo.jpg",
      },
    });

    /* Act */
    const result = await downloadService.download('tok-abc');

    /* Assert */
    expect(result).toBeUndefined();
    expect(mockClick).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock');
  });

  it('D.5 erreur 401 → ErrorMsg', async () => {
    /* Arrange */
    mockDownload.mockRejectedValueOnce({ response: { status: 401 } });

    /* Act */
    const result = await downloadService.download('tok-abc', 'wrongpw');

    /* Assert */
    expect(result).toMatchObject({ level: 'error' });
  });

  it('D.6 erreur 410 expiré → ErrorMsg', async () => {
    /* Arrange */
    mockDownload.mockRejectedValueOnce({ response: { status: 410 } });

    /* Act */
    const result = await downloadService.download('expired-tok');

    /* Assert */
    expect(result).toMatchObject({ level: 'error' });
  });
});
