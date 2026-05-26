# P4 - DataShare Front (Frontend)

## Présentation

DataShare est une SPA React permettant le partage sécurisé de fichiers via une interface simple et intuitive.

L'application propose :

- **Page d'accueil** (`/`) — formulaire de connexion / inscription avec switch Login↔Register
- **Mon espace** (`/my-space`) — liste des fichiers uploadés, liens de partage, tags, suppression
- **Upload** (`/upload`) — sélection du fichier, durée d'expiration, mot de passe optionnel, tags
- **Téléchargement** (`/download/:shareToken`) — page publique accessible sans compte, saisie du mot de passe si protégé

L'authentification est gérée via **cookie httpOnly** (mode web — posé par le serveur, jamais accessible en JS) ou **Bearer Token JWT en localStorage** (mode mobile uniquement). Un intercepteur Axios redirige automatiquement vers `/` en cas de token expiré (réponse 401).

## Stack technique

| Technologie      | Version | Rôle                               |
| ---------------- | ------- | ---------------------------------- |
| React            | 19.x    | Librairie UI                       |
| TypeScript       | strict  | Typage statique                    |
| Vite             | 8.x     | Bundler + dev server               |
| React Router DOM | ^6      | Routing SPA                        |
| Zustand          | ^5      | State management                   |
| Axios            | ^1      | Client HTTP (Bearer, interceptors) |
| Tailwind CSS     | v4      | Styles utilitaires                 |

## Architecture

```
src/
├── api/
│   ├── apiClient.ts      ← Axios (baseURL, withCredentials, interceptor 401)
│   ├── authApi.ts        ← login / register / logout
│   ├── fileApi.ts        ← getAll / upload / remove
│   ├── downloadApi.ts    ← getMeta / download
│   └── tagApi.ts         ← getAll / create / remove
├── infrastructure/
│   └── tokenStorage.ts   ← localStorage (mode mobile uniquement — web = cookie httpOnly)
├── services/
│   ├── authService.ts    ← login(), register(), logout()
│   ├── fileService.ts    ← getMyFiles(), uploadFile(), deleteFile()
│   ├── downloadService.ts← getMetadata(), downloadFile()
│   ├── tagService.ts     ← getTags(), createTag(), deleteTag()
│   └── serviceHelpers.ts ← catchApiError, getApiError
├── stores/
│   ├── authStore.ts      ← user, isAuthenticated
│   ├── fileStore.ts      ← files[]
│   └── tagStore.ts       ← tags[]
├── utils/
│   └── fieldValidation.ts← FieldValidator<T> classe stateless
└── views/
    ├── pages/
    │   ├── WelcomePage.tsx    ← Login / Register (switch)
    │   ├── MySpacePage.tsx    ← Liste fichiers + tags (protégée)
    │   ├── UploadPage.tsx     ← Upload fichier (protégée)
    │   └── DownloadPage.tsx   ← Téléchargement public via shareToken
    └── components/
        ├── shared/
        │   ├── Navbar.tsx · ProtectedRoute.tsx · Button.tsx · Callout.tsx
        │   ├── Footer.tsx · Sidebar.tsx · PageHeader.tsx · TagComponent.tsx
        │   └── forms/ (Form.tsx · InputField.tsx · SelectField.tsx)
        ├── routing/
        │   ├── ProtectedRoute.tsx · UploadRoute.tsx · ConfigPage.tsx
        ├── welcome/
        │   ├── LoginForm.tsx
        │   └── RegisterForm.tsx
        ├── myspace/
        │   └── FileCard.tsx
        ├── upload/
        │   └── UploadForm.tsx
        └── download/
            └── DownloadForm.tsx
```

Convention Clean Architecture :

```
UI Event -> Page (orchestration) -> Service (appel API) -> Api layer (Axios + Bearer)
                                                       -> Page met à jour le store
                                                                 -> Re-render composants abonnés
```

- **Pages** : orchestrent les composants, appellent les services, mettent à jour les stores
- **Composants** : UI pure — reçoivent des props, aucun appel API, aucune mutation de store
- **Stores** : état pur — setters uniquement, jamais d'appel réseau
- **Services** : appellent l'api layer et retournent les données typées
- **Api layer** : Axios centralisé — un seul endroit pour configurer `Authorization: Bearer`

## Prérequis

Le back-end DataShare doit tourner en local :

```bash
# Dans le dossier P4-BACK
docker compose up -d
npm run start:dev   # -> http://localhost:3000
```

## Installation

```bash
npm install
cp .env.example .env
```

## Variables d'environnement (`.env`)

```env
VITE_API_URL=http://localhost:3000/api/v1
NODE_ENV=development
```

## Lancement

```bash
npm run dev     # -> http://localhost:5173
npm run build   # Build production (0 erreur TypeScript)
```
