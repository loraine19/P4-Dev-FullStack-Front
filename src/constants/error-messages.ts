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
    NO_SHARE_TOKEN: 'Lien de partage indisponible après l’upload.',
  },
  TAGS: {
    CONFLICT: 'Ce tag existe déjà',
    INVALID_LENGTH: 'Le tag doit contenir entre 1 et 30 caractères.',
  },
} as const;
