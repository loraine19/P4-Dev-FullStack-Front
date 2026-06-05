import { useState, useEffect } from 'react';
import Button from '../shared/Button';
import Callout from '../shared/Callout';
import { ContentCopy } from '../shared/Icons';
import InputField from '../shared/forms/InputField';
import { useDownloadStoreShallow } from '../../../stores/downloadStore';
import { formatFileSize } from '../../../utils/formatFileSize';

/* DOWNLOAD FORM PROPS */
interface IDownloadFormProps {
  shareToken: string;
}

/* DOWNLOAD FORM */
const DownloadForm = ({ shareToken }: IDownloadFormProps) => {
  const { meta, metaError, downloadError, isLoading, getMeta, download } = useDownloadStoreShallow((s) => ({
    meta: s.meta,
    metaError: s.metaError,
    downloadError: s.downloadError,
    isLoading: s.isLoading,
    getMeta: s.getMeta,
    download: s.download,
  }));
  const [password, setPassword] = useState('');

  /* LOAD META */
  useEffect(() => {
    if (shareToken) void getMeta(shareToken);
  }, [shareToken, getMeta]);

  /* COPY SHARE LINK */
  const handleCopyLink = () => {
    if (!shareToken) return;
    void navigator.clipboard.writeText(`${window.location.origin}/download/${shareToken}`);
  };

  /* SUBMIT */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await download(shareToken, password || undefined);
  };

  return (
    <section className="card center-block min-w-full" aria-label="Formulaire de téléchargement">
      {metaError && <Callout error={metaError} />}

      {meta && (
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="row-grid-2">
            <Callout
            variant="info"
            message={`Fichier : ${meta.filename} - ${formatFileSize(meta.size)}`}
          />

            <button
          title="Copier le lien de partage"
            type="button"
            className="action-button"
            onClick={handleCopyLink}
            aria-label="Copier le lien de partage"
          >
            <ContentCopy className="action-button-icon" aria-hidden />
          </button>
          </div>
          {meta.requiresPassword && (
            <InputField
              id="download-password"
              label="Mot de passe"
              type="password"
              placeholder="Saisissez le mot de passe"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          {downloadError && <Callout error={downloadError} />}

          <Button type="submit" variant="secondary" disabled={isLoading}>
            {isLoading ? 'Téléchargement…' : 'Télécharger'}
          </Button>
        </form>
      )}
    </section>
  );
};

export default DownloadForm;
