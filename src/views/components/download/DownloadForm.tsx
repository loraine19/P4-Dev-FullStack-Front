import { useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Button from '../shared/Button';
import Callout from '../shared/Callout';
import InputField from '../shared/forms/InputField';
import useDownloadStore from '../../../stores/downloadStore';

/* DOWNLOAD FORM PROPS */
interface IDownloadFormProps {
  shareToken: string;
}

/* DOWNLOAD FORM */
const DownloadForm = ({ shareToken }: IDownloadFormProps) => {
  const { meta, metaError, downloadError, isLoading, getMeta, download } = useDownloadStore(
    useShallow((s) => ({
      meta: s.meta,
      metaError: s.metaError,
      downloadError: s.downloadError,
      isLoading: s.isLoading,
      getMeta: s.getMeta,
      download: s.download,
    })),
  );
  const [password, setPassword] = useState('');

  /* LOAD META */
  useEffect(() => {
    if (shareToken) void getMeta(shareToken);
  }, [shareToken, getMeta]);

  /* SUBMIT */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await download(shareToken, password || undefined);
  };

  return (
    <section className="card center-block" aria-label="Formulaire de téléchargement">
      {metaError && <Callout error={metaError} />}

      {meta && (
        <form className="form-grid" onSubmit={handleSubmit}>
          <Callout
            variant="info"
            message={`Fichier : ${meta.filename} -  ${(meta.size / 1024).toFixed(1)} Ko`}
          />

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
