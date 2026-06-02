export const ERROR_MESSAGES = {
  HTTP: {
    BAD_REQUEST:  'Requête invalide',
    UNAUTHORIZED: 'Non autorisé',
    FORBIDDEN:    'Interdit',
    NOT_FOUND:    'Non trouvé',
    GONE:         'Lien expiré',
    SERVER:       'Erreur serveur',
    NETWORK:      'Erreur réseau',
  },
  AUTH: {
    LOGIN_FAILED: 'Connexion échouée',
  },
  UPLOAD: {
    NO_FILE: 'Veuillez sélectionner un fichier.',
    FILE_TOO_LARGE: 'Fichier trop volumineux (maximum 1 Go)',
    INVALID_EXTENSION: (ext: string) => `Extension .${ext} non autorisée`,
    PASSWORD_TOO_SHORT: (min: number) => `Le mot de passe du fichier doit contenir au moins ${min} caractères.`,
  },
  TAGS: {
    CONFLICT: 'Ce tag existe déjà',
  },
} as const;
