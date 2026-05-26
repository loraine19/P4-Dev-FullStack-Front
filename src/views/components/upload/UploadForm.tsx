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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [expirationDays, setExpirationDays] = useState('7');
  const [tagInput, setTagInput] = useState('');
  const [selectedTagNames, setSelectedTagNames] = useState<string[]>([]);
  const [userTags, setUserTags] = useState<Tag[]>([]);
  const [error, setError] = useState<ErrorMsg | null>(null);
  const [loading, setLoading] = useState(false);

  /* LOAD TAGS */
  useEffect(() => {
    tagService.getAll().then((result) => {
      if (Array.isArray(result)) setUserTags(result);
    });
  }, []);

  /* TAG ACTIONS */
  const normalizedTag = useMemo(() => tagInput.trim().toLowerCase(), [tagInput]);
  const tagSuggestions = useMemo(() => userTags.map((t) => t.name), [userTags]);

  const handleAddTag = () => {
    if (!normalizedTag || selectedTagNames.includes(normalizedTag)) return;
    setSelectedTagNames((prev) => [...prev, normalizedTag]);
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

    const formData = new FormData();
    formData.append('file', file);
    formData.append('expirationDays', expirationDays);
    if (password) formData.append('downloadPassword', password);
    tagIds.forEach((id) => formData.append('tags', String(id)));

    setLoading(true);
    const result = await fileService.uploadFile(formData);
    setLoading(false);

    if (result && 'level' in result) {
      setError(result);
      return;
    }
    if (result) addFile(result);
    navigate('/my-space');
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
    </section>
  );
};

export default UploadForm;
