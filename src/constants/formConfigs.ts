import { RULES } from './validationRules';
import type { Rule, FieldRules } from '../utils/fieldValidation';

export type { FieldRules };

type FieldInput<T extends string> = {
  name: T;
  label: string;
  type?: string;
  autoComplete?: string;
  rules: Rule[];
};

export type TLoginField = 'email' | 'password';
export type TRegisterField = 'name' | 'email' | 'password' | 'passwordConfirm';

export const LOGIN_INPUTS: FieldInput<TLoginField>[] = [
  { name: 'email',    label: 'Email',        type: 'email',    autoComplete: 'email',            rules: [RULES.required('Email requis'), RULES.email('Format email invalide')] },
  { name: 'password', label: 'Mot de passe', type: 'password', autoComplete: 'current-password', rules: [RULES.required('Mot de passe requis')] },
];

export const REGISTER_INPUTS: FieldInput<TRegisterField>[] = [
  { name: 'name',            label: 'Nom',                          type: 'text',     autoComplete: 'name',         rules: [RULES.required('Nom requis')] },
  { name: 'email',           label: 'Email',                        type: 'email',    autoComplete: 'email',        rules: [RULES.required('Email requis'), RULES.email('Format email invalide')] },
  { name: 'password',        label: 'Mot de passe',                 type: 'password', autoComplete: 'new-password', rules: [RULES.required('Mot de passe requis'), RULES.minLen(8, '8 caractères min.')] },
  { name: 'passwordConfirm', label: 'Vérification du mot de passe', type: 'password', autoComplete: 'new-password', rules: [RULES.required('Confirmation requise'), RULES.matches('password', 'Les mots de passe ne correspondent pas')] },
];
