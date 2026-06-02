export interface ErrorMsg {
  message: string;
  level: 'error' | 'warning' | 'info';
}

export const isErrorMsg = (r: unknown): r is ErrorMsg =>
  typeof r === 'object' && r !== null && 'level' in r;
