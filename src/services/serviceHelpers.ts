import { ERROR_MESSAGES } from '../constants/error-messages';
import type { ErrorMsg } from '../types/error.types';

/* HTTP STATUS → MESSAGE */
export const HTTP_ERRORS: Record<number, string> = {
  400: ERROR_MESSAGES.HTTP.BAD_REQUEST,
  401: ERROR_MESSAGES.HTTP.UNAUTHORIZED,
  403: ERROR_MESSAGES.HTTP.FORBIDDEN,
  404: ERROR_MESSAGES.HTTP.NOT_FOUND,
  409: ERROR_MESSAGES.TAGS.CONFLICT,
  410: ERROR_MESSAGES.HTTP.GONE,
  500: ERROR_MESSAGES.HTTP.SERVER,
};

/* HELPER */
export const getErrorMessage = (status?: number) => {
  return HTTP_ERRORS[status ?? 500] ?? ERROR_MESSAGES.HTTP.NETWORK;
};

/* CATCH API ERROR */
export const catchApiError = (error: unknown): ErrorMsg => {
  const axiosError = error as { response?: { status?: number } } | null;
  const status = axiosError?.response?.status;
  const message = getErrorMessage(status);
  return { message, level: 'error' };
};
