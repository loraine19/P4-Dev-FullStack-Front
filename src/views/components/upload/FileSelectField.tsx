import { useRef } from 'react';
import InputField from '../shared/forms/InputField';
import { formatFileSize } from '../../../utils/formatFileSize';
import Callout from '../shared/Callout';
import { Change } from '../shared/Icons';

/* FILE SELECT FIELD PROPS */
interface IFileSelectFieldProps {
  id: string;
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
}

/* FILE SELECT FIELD */
const FileSelectField = ({ id, label, file, onFileChange }: IFileSelectFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  /* HANDLE CHANGE */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(event.target.files?.[0] ?? null);
    event.currentTarget.value = '';
  };

  /* OPEN PICKER */
  const openPicker = () => inputRef.current?.click();

  if (file) {
    return (
      <div className="selected-file-name">
        <span className="form-label" id={`${id}-label`}>
          {label}
        </span>
        <div className="row-grid-2 ">
        <Callout 
            variant="success"
            message={`Fichier : ${file.name} - ${formatFileSize(file.size)}`}
          />
           <button
          title="Changer de fichier"
            type="button"
            className="action-button"
            onClick={openPicker}
            aria-label="Changer de fichier"
          >
            <Change className="action-button-icon" aria-hidden />
          </button>
        </div>
        <input
          ref={inputRef}
          id={id}
          type="file"
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={handleChange}
        />
      </div>
    );
  }

  return (
    <InputField
      id={id}
      label={label}
      type="file"
      inputClassName="form-file"
      onChange={handleChange}
    />
  );
};

export default FileSelectField;
