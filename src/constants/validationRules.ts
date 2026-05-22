import type { Rule } from '../utils/fieldValidation';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* RULES */
export const RULES = {
  required: (message: string): Rule => ({
    test: (value) => value.trim() !== '',
    message,
  }),

  email: (message: string): Rule => ({
    test: (value) => EMAIL_PATTERN.test(value),
    message,
  }),

  minLen: (n: number, message: string): Rule => ({
    test: (value) => value.length >= n,
    message,
  }),

  matches: (field: string, message: string): Rule => ({
    // compares value against another field in the same form values
    test: (value, values) => value === values?.[field],
    message,
  }),
};
