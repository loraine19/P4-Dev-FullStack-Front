import type { TFieldValues } from './fieldValidation';

export type TLoginField = 'email' | 'password';
export type TRegisterField = 'name' | 'email' | 'password' | 'passwordConfirm';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* VALIDATE LOGIN FIELD */
export const validateLoginField = (
  field: TLoginField,
  value: string,
  _values: TFieldValues<TLoginField>,
) => {
  switch (field) {
    case 'email':
      if (!value.trim()) return 'Email requis';
      if (!EMAIL_PATTERN.test(value)) return 'Format email invalide';
      return '';
    case 'password':
      return value.trim() ? '' : 'Mot de passe requis';
    default:
      return '';
  }
};

/* VALIDATE REGISTER FIELD */
export const validateRegisterField = (
  field: TRegisterField,
  value: string,
  values: TFieldValues<TRegisterField>,
) => {
  switch (field) {
    case 'name':
      return value.trim() ? '' : 'Nom requis';
    case 'email':
      if (!value.trim()) return 'Email requis';
      if (!EMAIL_PATTERN.test(value)) return 'Format email invalide';
      return '';
    case 'password':
      if (!value.trim()) return 'Mot de passe requis';
      if (value.length < 8) return '8 caractères min.';
      return '';
    case 'passwordConfirm':
      if (!value.trim()) return 'Confirmation requise';
      if (value !== values.password) return 'Les mots de passe ne correspondent pas';
      return '';
    default:
      return '';
  }
};