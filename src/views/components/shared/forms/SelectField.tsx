import type { SelectHTMLAttributes } from 'react';

/* SELECT OPTION */
interface ISelectOption {
  value: string;
  label: string;
}

/* SELECT FIELD PROPS */
interface ISelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: ISelectOption[];
  error?: string;
  className?: string;
}

/* SELECT FIELD */
const SelectField = ({ id, label, options, error, className = '', ...props }: ISelectFieldProps) => {
  return (
    <div className={className}>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <select id={id} className="form-select" aria-invalid={Boolean(error)} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default SelectField;