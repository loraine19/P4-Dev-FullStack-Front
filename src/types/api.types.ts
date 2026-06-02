export interface ApiResponseEnvelope<T> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
}
