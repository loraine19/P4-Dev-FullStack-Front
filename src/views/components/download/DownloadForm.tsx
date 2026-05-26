import { useState, useEffect } from 'react';
import Button from '../shared/Button';
import Callout from '../shared/Callout';
import InputField from '../shared/forms/InputField';
import { downloadService } from '../../../services/downloadService';
import type { DownloadMeta } from '../../../types/file.types';
import type { ErrorMsg } from '../../../types/error.types';

/* DOWNLOAD FORM PROPS */
interface IDownloadFormProps {
  shareToken: string;
}

/* DOWNLOAD FORM */
const DownloadForm = ({ shareToken }: IDownloadFormProps) => {
  const [meta, setMeta] = useState<DownloadMeta | null>(null);
  const [metaError, setMetaError] = useState<ErrorMsg | null>(null);
  const [password, setPassword] = useState('');
  const [downloadError, setDownloadError] = useState<ErrorMsg | null>(null);
  const [loading, setLoading] = useState(false);

  /* LOAD META */
  useEffect(() => {
    if (!shareToken) return;
    downloadService.getMeta(shareToken).then((result) => {
      if ('level' in result) {
        setMetaError(result);
      } else {
        setMeta(result);
      }
    });
  }, [shareToken]);

  /* SUBMIT */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDownloadError(null);
    setLoading(true);
    const result = await downloadService.download(shareToken, password || undefined);
    setLoading(false);
    if (result && 'level' in result) setDownloadError(result);
  };

  return (
    <section className="card center-block" aria-label="Formulaire de téléchargement">
      {metaError && <Callout error={metaError} />}

      {meta && (
        <form className="form-grid" onSubmit={handleSubmit}>
          <Callout
            variant="info"
            message={`Fichier : ${meta.filename} — ${(meta.size / 1024).toFixed(1)} Ko`}
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

          <Button type="submit" variant="secondary" disabled={loading}>
            {loading ? 'Téléchargement…' : 'Télécharger'}
          </Button>
        </form>
      )}
    </section>
  );
};

export default DownloadForm;
