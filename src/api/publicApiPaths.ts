/* SHOULD CLEAR TOKEN ON 401 */
export const shouldClearTokenOn401 = (url: string): boolean => !url.includes('/download/');

/* SHOULD REDIRECT ON 401 */
export const shouldRedirectOn401 = (url: string): boolean =>
  !url.includes('/download/')
  && !url.includes('/auth/me')
  && !url.includes('/auth/login')
  && !url.includes('/auth/register')
  && !url.includes('/files/anonymous');
