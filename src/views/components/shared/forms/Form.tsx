import { useMemo, useState } from 'react';
import type { Rule, FieldErrors, FieldRules, FieldValues } from '../../../../utils/fieldValidation';
import { validate, validateAll } from '../../../../utils/fieldValidation';
import InputField from './InputField';
import Button from '../Button';

/* INPUT CONFIG */
export type InputConfig<T extends string> = {
  name: T;
  label: string;
  type?: string;
  autoComplete?: string;
  rules: Rule[];
};

/* FORM PROPS */
interface IFormProps<T extends string> {
  id: string;
  title: string;
  inputs: InputConfig<T>[];
  onSubmit: (values: FieldValues<T>) => Promise<boolean | void>;
  submitLabel: string;
  loading?: boolean;
  error?: string;
  footer?: React.ReactNode;
}

/* FORM */
const Form = <T extends string>({
  id,
  title,
  inputs,
  onSubmit,
  submitLabel,
  loading = false,
  error,
  footer,
}: IFormProps<T>) => {
  const [values, setValues] = useState<FieldValues<T>>(
    () => Object.fromEntries(inputs.map((i) => [i.name, ''])) as FieldValues<T>,
  );
  const [errors, setErrors] = useState<FieldErrors<T>>({});

  // build rules map once from inputs config
  const rules = useMemo(
    () => Object.fromEntries(inputs.map((i) => [i.name, i.rules])) as FieldRules<T>,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /* HANDLE CHANGE */
  const handleChange = (name: T) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [name]: event.target.value }));
    // clear field error on change
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  /* HANDLE BLUR */
  const handleBlur = (name: T) => (event: React.FocusEvent<HTMLInputElement>) => {
    const err = validate(event.target.value, rules[name] ?? [], values);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  /* HANDLE SUBMIT */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const allErrors = validateAll(values, rules);
    setErrors(allErrors);
    if (Object.values(allErrors).some(Boolean)) return;
    await onSubmit(values);
  };

  return (
    <section className="card" aria-label={title}>
      <h2 className="card-title">{title}</h2>
      <form
        id={id}
        className="form-grid"
        onSubmit={handleSubmit}
        noValidate>
        {inputs.map((input) => (
          <InputField
            key={input.name}
            id={`${id}-${input.name}`}
            label={input.label}
            type={input.type ?? 'text'}
            autoComplete={input.autoComplete}
            value={values[input.name]}
            onChange={handleChange(input.name)}
            onBlur={handleBlur(input.name)}
            disabled={loading}
            error={errors[input.name]}
          />
        ))}
        { /* CALL OUT ERROR */}
        {error ? (
          <div className="callout callout-error" role="alert">
            {error}
          </div>
        ) : null}
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? `${submitLabel}...` : submitLabel}
        </Button>
      </form>
      {footer ?? null}
    </section>
  );
};

export default Form;
