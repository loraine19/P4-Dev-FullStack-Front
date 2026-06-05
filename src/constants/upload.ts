/* UPLOAD CONSTRAINTS */
export const MAX_FILE_SIZE = 1 * 1024 * 1024 * 1024; // 1 GB
export const FILE_PASSWORD_MIN_LENGTH = 6;
export const TAG_NAME_MIN_LENGTH = 1;
export const TAG_NAME_MAX_LENGTH = 30;

export const FORBIDDEN_EXTENSIONS = new Set([
  'exe',
  'bat',
  'cmd',
  'com',
  'msi',
  'scr',
  'ps1',
  'sh',
  'jar',
  'app',
  'dmg',
  'vbs',
]);
