/* TYPES */
export type Rule = {
  test: (value: string, values?: Record<string, string>) => boolean;
  message: string;
};

export type FieldRules<T extends string> = Record<T, Rule[]>;
export type FieldValues<T extends string> = Record<T, string>;
export type FieldErrors<T extends string> = Partial<Record<T, string>>;

/* VALIDATE */
// runs rules in order, returns first error message or ''
export const validate = (
  value: string,
  rules: Rule[],
  values?: Record<string, string>,
): string => {
  for (const rule of rules) {
    if (!rule.test(value, values)) return rule.message;
  }
  return '';
};

/* VALIDATE ALL */
// validates all fields at once, returns { field: errorMsg }
export const validateAll = <T extends string>(
  values: FieldValues<T>,
  rules: FieldRules<T>,
): FieldErrors<T> => {
  const errors = {} as FieldErrors<T>;
  (Object.keys(values) as T[]).forEach((field) => {
    errors[field] = validate(values[field], rules[field] ?? [], values);
  });
  return errors;
};
