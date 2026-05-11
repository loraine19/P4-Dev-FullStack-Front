import { CloudUpload } from '@project-lary/react-material-symbols';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useFileStore from '../../../stores/fileStore';
import { MAX_FILE_SIZE, FORBIDDEN_EXTENSIONS } from '../../../constants/upload';

declare global {
  interface Window {
    showOpenFilePicker?: (options?: {
      multiple?: boolean;
    }) => Promise<Array<{ getFile: () => Promise<File> }>>;
  }
}

/* UPLOAD BUTTON */
const UploadButton = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { setUploadingFile, uploadingFile } = useFileStore();
  const navigate = useNavigate();

  /* VALIDATE FILE */
  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      return 'Le fichier dépasse la taille maximale autorisée de 1 Go.';
    }

    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (FORBIDDEN_EXTENSIONS.has(extension)) {
      return `Le type de fichier .${extension} est interdit.`;
    }

    return '';
  };

  /* SAVE SELECTED FILE */
  const saveSelectedFile = (file: File) => {
    const nextError = validateFile(file);

    if (nextError) {
      setUploadingFile({ file: null, error: nextError, name: '' });
      return;
    }

    setUploadingFile({ file, error: '', name: file.name });
    navigate('/upload');
  };

  /* OPEN INPUT FALLBACK */
  const openInputFallback = () => {
    inputRef.current?.click();
  };

  /* OPEN PICKER */
  const openPicker = async () => {
    if (typeof window.showOpenFilePicker !== 'function') {
      openInputFallback();
      return;
    }

    try {
      const [fileHandle] = await window.showOpenFilePicker({ multiple: false });
      if (!fileHandle) {
        return;
      }

      const file = await fileHandle.getFile();
      saveSelectedFile(file);
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      // if picker API fails in the current context, fallback to native input
      openInputFallback();
    }
  };

  /* HANDLE FALLBACK CHANGE */
  const handleFallbackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      return;
    }

    saveSelectedFile(file);
    event.currentTarget.value = '';
  };

  return (
    <div className="upload-button-wrap">
      <input
        ref={inputRef}
        type="file"
        className="upload-button-input sr-only"
        onChange={handleFallbackChange}
      />
      <button
        type="button"
        className="upload-button"
        onClick={openPicker}
        aria-label="Choisir un fichier"
      >
        <CloudUpload className="upload-button-icon" />
      </button>

      <p>{uploadingFile?.name}</p>
      {uploadingFile?.error ? <p className="field-error" role="alert">{uploadingFile.error}</p> : null}
    </div>
  );
};

export default UploadButton;