export type TFieldErrors<T extends string> = Partial<Record<T, string>>;
export type TFieldValues<T extends string> = Record<T, string>;
export type TValidateField<T extends string> = (field: T, value: string, values: TFieldValues<T>) => string;

/* FIELD VALIDATOR */
// stateless validator — field error state stays in the component (useState)
export class FieldValidator<T extends string> {
  constructor(private readonly validateField: TValidateField<T>) {}

  /* VALIDATE ONE */
  validateOne(field: T, value: string, values: TFieldValues<T>): string {
    return this.validateField(field, value, values);
  }

  /* VALIDATE ALL */
  validateAll(values: TFieldValues<T>): TFieldErrors<T> {
    const errors = {} as TFieldErrors<T>;
    (Object.keys(values) as T[]).forEach((field) => {
      errors[field] = this.validateField(field, values[field], values);
    });
    return errors;
  }
}
