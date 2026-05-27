import type { ErrorMsg } from '../types/error.types';
import type { ApiResponseEnvelope } from '../types/user.types';

// resilience: handles HTTP 200 with { status: 'error' } -  backend currently always throws 4xx/5xx,
// but this guard future-proofs soft-error patterns without silent failures
export const getApiError = (res: ApiResponseEnvelope<unknown>): ErrorMsg | null =>
  res.status === 'error'
    ? { message: res.message || 'Unknown error', level: 'error' }
    : null;

export const catchApiError = (error: unknown): ErrorMsg => {
  let message = 'Erreur réseau';
  const axiosError = error as { response?: { status?: number } } | null;
  switch (axiosError?.response?.status) {
    case 400:
      message = 'Requete invalide';
      break;
    case 401:
      message = 'Non autorisé';
      break;
    case 403:
      message = 'Interdit';
      break;
    case 404:
      message = 'Non trouvé';
      break;
    case 410:
      message = 'Lien expiré';
      break;
    case 500:
      message = 'Erreur serveur';
      break;
  }
  return { message, level: 'error' };
};
