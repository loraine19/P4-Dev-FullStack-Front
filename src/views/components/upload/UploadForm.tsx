import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import Button from '../shared/Button';
import InputField from '../shared/forms/InputField';
import SelectField from '../shared/forms/SelectField';
import TagComponent from '../shared/TagComponent';
import Callout from '../shared/Callout';
import useFileStore from '../../../stores/fileStore';
import useTagStore from '../../../stores/tagStore';
import { ERROR_MESSAGES } from '../../../constants/error-messages';
import { FILE_PASSWORD_MIN_LENGTH } from '../../../constants/upload';
import type { ErrorMsg } from '../../../types/error.types';
import { EXPIRATION_OPTIONS } from './options';
import type { Tag } from '../../../types/tag.types';

/* UPLOAD FORM */
const UploadForm = () => {
  const navigate = useNavigate();

  /* STORES */
  const { upload, isLoading, error: fileError, shareToken, clearUploadingFile } = useFileStore(
    useShallow((s) => ({
      upload: s.upload,
      isLoading: s.isLoading,
      error: s.error,
      shareToken: s.shareToken,
      clearUploadingFile: s.clearUploadingFile,
    })),
  );
  const { tags, addTagByName, errorTags, loadTags } = useTagStore(
    useShallow((s) => ({ tags: s.tags, addTagByName: s.addTagByName, errorTags: s.errorTags, loadTags: s.loadTags })),
  );

  /* FORM STATE */
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [expirationDays, setExpirationDays] = useState('7');
  const [tagInput, setTagInput] = useState('');
  const [validationError, setValidationError] = useState<ErrorMsg | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  /* LOAD TAGS */
  useEffect(() => {
    void loadTags();
  }, [loadTags]);

  /* PENDING FILE FROM UPLOAD BUTTON */
  useEffect(() => {
    const pending = useFileStore.getState().uploadingFile?.file ?? null;
    if (!pending) return;
    setSelectedFile(pending);
    clearUploadingFile();
  }, [clearUploadingFile]);

  /* HANDLE ADD TAG */
  const handleAddTag = async () => {
    const newTag = await addTagByName(tagInput.trim());
    if (newTag) {
      setSelectedTags([...selectedTags, newTag]);
      setTagInput('');
    }
  };

  /* SUBMIT */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!selectedFile) {
      setValidationError({ message: ERROR_MESSAGES.UPLOAD.NO_FILE, level: 'error' });
      return;
    }
    if (password && password.length < FILE_PASSWORD_MIN_LENGTH) {
      setValidationError({ message: ERROR_MESSAGES.UPLOAD.PASSWORD_TOO_SHORT(FILE_PASSWORD_MIN_LENGTH), level: 'error' });
      return;
    }
    const tagIds = selectedTags.map((tag) => tag.id);
    const success = await upload({ file: selectedFile, expirationDays: Number(expirationDays), password, tagIds });
    if (success && !useFileStore.getState().shareToken) navigate('/my-space');
  };

  const displayError = validationError ?? fileError ?? errorTags;

  return (
    <section className="card center-block sheet-mobile" aria-label="Formulaire d'upload">
      <h2 className="card-title">Uploader un fichier</h2>

      <form className="form-grid" onSubmit={handleSubmit}>
        {displayError && <Callout error={displayError} />}

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
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          onChange={setTagInput}
          tags={tags}
          onAdd={handleAddTag}
          placeholder="design, client, facture"
        />

        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Upload en cours…' : 'Générer un lien de partage'}
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
