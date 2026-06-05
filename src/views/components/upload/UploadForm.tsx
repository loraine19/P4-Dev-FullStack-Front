import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../shared/Button';
import FileSelectField from './FileSelectField';
import InputField from '../shared/forms/InputField';
import SelectField from '../shared/forms/SelectField';
import TagComponent from '../shared/TagComponent';
import Callout from '../shared/Callout';
import { useAuthStoreShallow } from '../../../stores/authStore';
import useFileStore, { useFileStoreShallow } from '../../../stores/fileStore';
import { useTagStoreShallow } from '../../../stores/tagStore';
import { ERROR_MESSAGES } from '../../../constants/error-messages';
import { FILE_PASSWORD_MIN_LENGTH, TAG_NAME_MAX_LENGTH, TAG_NAME_MIN_LENGTH } from '../../../constants/upload';
import type { ErrorMsg } from '../../../types/error.types';
import { EXPIRATION_OPTIONS } from './options';
import type { Tag } from '../../../types/tag.types';

/* UPLOAD FORM */
type UploadLocationState = { preselectedFile?: File };

const UploadForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* STORES */
  const { isAuthenticated } = useAuthStoreShallow((s) => ({ isAuthenticated: s.isAuthenticated }));
  const { upload, isLoading, error: fileError, uploadingFile, clearUploadingFile } = useFileStoreShallow((s) => ({
    upload: s.upload,
    isLoading: s.isLoading,
    error: s.error,
    uploadingFile: s.uploadingFile,
    clearUploadingFile: s.clearUploadingFile,
  }));
  const { tags, addTagByName, errorTags, loadTags } = useTagStoreShallow((s) => ({
    tags: s.tags,
    addTagByName: s.addTagByName,
    errorTags: s.errorTags,
    loadTags: s.loadTags,
  }));

  /* FORM STATE */
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [expirationDays, setExpirationDays] = useState('7');
  const [tagInput, setTagInput] = useState('');
  const [validationError, setValidationError] = useState<ErrorMsg | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  /* LOAD TAGS */
  useEffect(() => {
    if (!isAuthenticated) return;
    void loadTags();
  }, [isAuthenticated, loadTags]);

  /* PENDING FILE FROM UPLOAD BUTTON */
  useEffect(() => {
    const fromRoute = (location.state as UploadLocationState | null)?.preselectedFile;
    const fromStore = uploadingFile?.file ?? null;
    const pending = fromRoute ?? fromStore;
    if (!pending) return;
    setSelectedFile((prev) => prev ?? pending);
    clearUploadingFile();
    if (fromRoute) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, uploadingFile, clearUploadingFile, navigate]);

  /* HANDLE ADD TAG */
  const handleAddTag = async () => {
    const name = tagInput.trim();
    if (name.length < TAG_NAME_MIN_LENGTH || name.length > TAG_NAME_MAX_LENGTH) {
      setValidationError({ message: ERROR_MESSAGES.TAGS.INVALID_LENGTH, level: 'error' });
      return;
    }
    const newTag = await addTagByName(name);
    if (newTag && !selectedTags.some((t) => t.id === newTag.id)) {
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
    if (!success) return;
    const token = useFileStore.getState().shareToken;
    if (token) {
      navigate(`/download/${token}`);
      return;
    }
    if (isAuthenticated) {
      navigate('/my-space');
      return;
    }
    setValidationError({ message: ERROR_MESSAGES.UPLOAD.NO_SHARE_TOKEN, level: 'error' });
  };

  const displayError = validationError ?? fileError ?? errorTags;

  return (
    <section className="card center-block sheet-mobile" aria-label="Formulaire d'upload">
      <h2 className="card-title">Uploader un fichier</h2>

      <form className="form-grid" onSubmit={handleSubmit}>
        {displayError && <Callout error={displayError} />}

        <FileSelectField
          id="upload-file"
          label="Fichier"
          file={selectedFile}
          onFileChange={(file) => {
            setSelectedFile(file);
            clearUploadingFile();
          }}
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

        {isAuthenticated ? (
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
        ) : null}

        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Upload en cours…' : 'Générer un lien de partage'}
        </Button>
      </form>
    </section>
  );
};

export default UploadForm;
