import { describe, it, expect } from 'vitest';
import { catchApiError, getErrorMessage, HTTP_ERRORS } from './serviceHelpers';
import { ERROR_MESSAGES } from '../constants/error-messages';

const makeAxiosError = (status: number) => ({ response: { status } });
const UNMAPPED_STATUS = 503;

type THttpErrorCase = { status: number; message: string };

const HTTP_ERROR_CASES: THttpErrorCase[] = Object.entries(HTTP_ERRORS).map(
  ([status, message]) => ({ status: Number(status), message }),
);

/* GET ERROR MESSAGE */
describe('getErrorMessage', () => {
  it(' assigns HTTP_ERRORS from typed ERROR_MESSAGES constants', () => {
    expect(HTTP_ERRORS).toEqual({
      400: ERROR_MESSAGES.HTTP.BAD_REQUEST,
      401: ERROR_MESSAGES.HTTP.UNAUTHORIZED,
      403: ERROR_MESSAGES.HTTP.FORBIDDEN,
      404: ERROR_MESSAGES.HTTP.NOT_FOUND,
      409: ERROR_MESSAGES.TAGS.CONFLICT,
      410: ERROR_MESSAGES.HTTP.GONE,
      500: ERROR_MESSAGES.HTTP.SERVER,
    });
    expect(getErrorMessage(UNMAPPED_STATUS)).toBe(ERROR_MESSAGES.HTTP.NETWORK);
  });

  HTTP_ERROR_CASES.forEach(({ status, message }, i) => {
    it(`${i + 1}. maps status ${status} via HTTP_ERRORS`, () => {
      expect(getErrorMessage(status)).toBe(message);
    });
  });

  it('0. uses HTTP_ERRORS[500] when status is undefined', () => {
    expect(getErrorMessage(undefined)).toBe(HTTP_ERRORS[500]);
  });
});

/* CATCH API ERROR */
describe('catchApiError', () => {
  it('1. delegates mapped status to getErrorMessage', () => {
    const { status, message } = HTTP_ERROR_CASES[0];
    expect(catchApiError(makeAxiosError(status))).toEqual({ message, level: 'error' });
    expect(catchApiError(makeAxiosError(status)).message).toBe(getErrorMessage(status));
  });

  it('2. delegates unmapped status to getErrorMessage', () => {
    expect(catchApiError(makeAxiosError(UNMAPPED_STATUS)).message).toBe(getErrorMessage(UNMAPPED_STATUS));
  });

  it('3. delegates missing response to getErrorMessage', () => {
    expect(catchApiError(new Error('Network error')).message).toBe(getErrorMessage(undefined));
  });

  it('4. always returns level error', () => {
    expect(catchApiError(null).level).toBe('error');
  });
});
