import type { InputHTMLAttributes } from 'react';

/* INPUT FIELD PROPS */
interface IInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
  inputClassName?: string;
}

/* INPUT FIELD */
const InputField = ({
  id,
  label,
  error,
  helperText,
  className = '',
  inputClassName = 'form-input',
  ...props
}: IInputFieldProps) => {
  const describedBy = error ? `${id}-error` : helperText ? `${id}-help` : undefined;

  return (
    <div className={className}>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input id={id} className={inputClassName} aria-invalid={Boolean(error)} aria-describedby={describedBy} {...props} />
      {helperText ? (
        <p id={`${id}-help`} className="field-help">
          {helperText}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default InputField;