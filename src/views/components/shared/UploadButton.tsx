import { CloudUpload } from './Icons';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import useFileStore from '../../../stores/fileStore';
import { MAX_FILE_SIZE, FORBIDDEN_EXTENSIONS } from '../../../constants/upload';
import { ERROR_MESSAGES } from '../../../constants/error-messages';

// augments Window to declare non-standard File System Access API (not yet in lib.dom.d.ts)
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
  const navigate = useNavigate();
  const { uploadingFile, setUploadingFile } = useFileStore(
    useShallow((s) => ({ uploadingFile: s.uploadingFile, setUploadingFile: s.setUploadingFile })),
  );

  /* VALIDATE FILE */
  const validateFile = ({ size, name }: File): string => {
    if (size > MAX_FILE_SIZE) return ERROR_MESSAGES.UPLOAD.FILE_TOO_LARGE;
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    if (FORBIDDEN_EXTENSIONS.has(ext)) return ERROR_MESSAGES.UPLOAD.INVALID_EXTENSION(ext);
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
