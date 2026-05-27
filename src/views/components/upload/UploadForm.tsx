import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../shared/Button';
import InputField from '../shared/forms/InputField';
import SelectField from '../shared/forms/SelectField';
import TagComponent from '../shared/TagComponent';
import Callout from '../shared/Callout';
import { fileService } from '../../../services/fileService';
import { tagService } from '../../../services/tagService';
import useFileStore from '../../../stores/fileStore';
import useAuthStore from '../../../stores/authStore';
import type { Tag } from '../../../types/tag.types';
import type { ErrorMsg } from '../../../types/error.types';

/* EXPIRATION OPTIONS (in days) */
const EXPIRATION_OPTIONS = [
  { value: '1', label: '1 jour' },
  { value: '2', label: '2 jours' },
  { value: '3', label: '3 jours' },
  { value: '5', label: '5 jours' },
  { value: '7', label: '7 jours' },
];

/* UPLOAD FORM */
const UploadForm = () => {
  const navigate = useNavigate();
  const addFile = useFileStore((s) => s.addFile);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [expirationDays, setExpirationDays] = useState('7');
  const [tagInput, setTagInput] = useState('');
  const [selectedTagNames, setSelectedTagNames] = useState<string[]>([]);
  const [userTags, setUserTags] = useState<Tag[]>([]);
  const [error, setError] = useState<ErrorMsg | null>(null);
  const [loading, setLoading] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);

  /* LOAD TAGS */
  useEffect(() => {
    tagService.getAll().then((result) => {
      if (Array.isArray(result)) setUserTags(result);
    });
  }, []);

  /* TAG ACTIONS */
  const normalizedTag = useMemo(() => tagInput.trim().toLowerCase(), [tagInput]);
  const tagSuggestions = useMemo(() => userTags.map((t) => t.name), [userTags]);

  const handleAddTag = async () => {
    if (!normalizedTag) return;
    const existing = userTags.find((t) => t.name.toLowerCase() === normalizedTag);
    if (existing) {
      if (selectedTagNames.some((n) => n.toLowerCase() === normalizedTag)) return;
      setSelectedTagNames((prev) => [...prev, existing.name]);
      setTagInput('');
      return;
    }
    const result = await tagService.create(tagInput.trim());
    if ('level' in result) { setError(result); return; }
    setUserTags((prev) => [...prev, result]);
    setSelectedTagNames((prev) => [...prev, result.name]);
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTagNames((prev) => prev.filter((t) => t !== tagToRemove));
  };

  /* SUBMIT */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const file = selectedFile;
    if (!file) {
      setError({ message: 'Veuillez sélectionner un fichier.', level: 'error' });
      return;
    }

    const tagIds = selectedTagNames
      .map((name) => userTags.find((t) => t.name === name)?.id)
      .filter((id): id is number => id !== undefined);

    // move to service: FormData construction belongs in uploadService, not in the component
    const formData = new FormData();
    formData.append('file', file);
    formData.append('expirationDays', expirationDays);
    if (password) formData.append('downloadPassword', password);
    tagIds.forEach((id) => formData.append('tags', String(id)));

    setLoading(true);
    const result = isAuthenticated
      ? await fileService.uploadFile(formData)
      : await fileService.uploadFileAnonymous(formData);
    setLoading(false);

    if (result && 'level' in result) {
      setError(result);
      return;
    }
    if (result) {
      if (isAuthenticated) {
        addFile(result);
        navigate('/my-space');
      } else {
        setShareToken(result.shareToken);
      }
    }
  };

  return (
    <section className="card center-block sheet-mobile" aria-label="Formulaire d'upload">
      <h2 className="card-title">Uploader un fichier</h2>

      <form className="form-grid" onSubmit={handleSubmit}>
        {error && <Callout error={error} />}

        <InputField
          id="upload-file"
          label="Fichier"
          type="file"
          inputClassName="form-file"
          onChange={(e) => setSelectedFile((e.target as HTMLInputElement).files?.[0] ?? null)}
        />

        <div className="grid-2">
          <SelectField
            id="upload-expiration"
            className="grid-1"
            label="Durée d'expiration"
            value={expirationDays}
            onChange={(e) => setExpirationDays(e.target.value)}
            options={EXPIRATION_OPTIONS}
          />

          <InputField
            id="upload-password"
            className="grid-1"
            label="Mot de passe (optionnel)"
            type="password"
            placeholder="Ajouter un mot de passe"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <TagComponent
          id="upload-tags"
          label="Tags"
          value={tagInput}
          onChange={setTagInput}
          suggestions={tagSuggestions}
          tags={selectedTagNames}
          onAdd={handleAddTag}
          onRemove={handleRemoveTag}
          placeholder="design, client, facture"
        />

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Upload en cours…' : 'Générer un lien de partage'}
        </Button>
      </form>

      {shareToken && (
        <div className="share-link-block" aria-label="Lien de partage">
          <p>Votre lien de partage :</p>
          <a href={`/download/${shareToken}`}>{window.location.origin}/download/{shareToken}</a>
        </div>
      )}
    </section>
  );
};

export default UploadForm;
