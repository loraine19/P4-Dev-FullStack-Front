# CHANGELOG — main

**Sprint step** : STEP 2 + STEP 3 — Initialisation + US03/US04 (auth hybride front)
**Branche** : `main`

**Objectif** : Socle React/Vite — pattern classe+interface+singleton, stores Zustand, routing protégé, et adaptation à l'auth hybride cookie httpOnly (web) + Bearer (mobile).

---

## Ce qui est en place

| Thème | Ce qui est opérationnel |
| :--- | :--- |
| Routing | React Router DOM v6 — 4 routes, `ProtectedRoute`, `ConfigPage` layout |
| Pattern API | `class XxxApi implements IXxxApi` → `export const xxxApi` (singleton) |
| Pattern service | `class XxxService implements IXxxService` → `export const xxxService` |
| Stores Zustand | `authStore`, `fileStore`, `tagStore` — double interface State+Actions |
| Auth hybride | `withCredentials: true` + token localStorage si `isMobile` uniquement |
| Validation | `FieldValidator<T>` — classe stateless, sans hook |
| Gestion erreurs | `catchApiError` / `getApiError` — helpers dans `serviceHelpers.ts` |
| Styles | Tailwind CSS v4 via `@tailwindcss/vite` |

---

## Choix techniques

### Pattern classe+interface+singleton

Chaque couche expose une interface puis une implémentation, exportée comme singleton :

```ts
interface IFileApi { ... }
class FileApi implements IFileApi { ... }
export const fileApi = new FileApi();
```

Avantage : mockable en test, typage fort, pas de state dans la couche API.

### Auth hybride

`withCredentials: true` sur l'instance Axios — le cookie httpOnly est envoyé automatiquement (web).
`authService.login()` stocke `access_token` en localStorage **uniquement** si `isMobile: true`.
L'intercepteur 401 efface le token et redirige vers `/` dans les deux cas.

### FieldValidator — pas de hook de validation

`FieldValidator<T>` est une classe pure instanciée au niveau module (pas dans le composant).
Pas de hook (`useFieldValidation`) — les hooks ajoutent un cycle de vie React inutile pour de la validation stateless.

### serviceHelpers — gestion erreurs uniforme

`catchApiError(error)` — wraps les erreurs réseau/axios en `ErrorMsg`.
`getApiError(data)` — lit `ApiResponseEnvelope.status === "error"` et retourne `ErrorMsg | null`.
Les services ne lèvent jamais d'exception — ils retournent `ErrorMsg | T`.

### Stores Zustand — double interface

```ts
interface IDomainState { ... }
interface IDomainActions { ... }
const useDomainStore = create<IDomainState & IDomainActions>(...)
```

`useShallow` pour sélectionner plusieurs champs à la fois, sélecteur simple sinon.

---

## Structure des fichiers notables

```
src/
  App.tsx                        — routing, ProtectedRoute, ConfigPage layout
  api/
    apiClient.ts                 — Axios, withCredentials, intercepteur 401
    authApi.ts                   — IAuthApi, authApi singleton
    fileApi.ts                   — IFileApi, fileApi singleton
    tagApi.ts                    — ITagApi, tagApi singleton (singulier)
    downloadApi.ts               — IDownloadApi, downloadApi singleton
  services/
    authService.ts               — login(), register(), logout()
    fileService.ts               — getMyFiles(), uploadFile(), deleteFile()
    serviceHelpers.ts            — catchApiError, getApiError
  stores/
    authStore.ts                 — IAuthState + IAuthActions, useAuthStore
    fileStore.ts                 — IFileState + IFileActions, useFileStore
    tagStore.ts                  — ITagState + ITagActions, useTagStore (singulier)
  utils/
    tokenStorage.ts              — TokenStorage, tokenStorage singleton
    fieldValidation.ts           — FieldValidator<T> classe stateless
    authValidation.ts            — validateLoginField, validateRegisterField
    mockFiles.ts                 — FILE_STATUS as const, IFile, TFileStatus
  views/
    components/
      routing/
        ProtectedRoute.tsx       — redirige vers / si non authentifié
        ConfigPage.tsx           — layout commun (Navbar + Sidebar + outlet)
        UploadRoute.tsx
      shared/
        Navbar.tsx · Sidebar.tsx · Switch.tsx · ContextMenu.tsx
        UploadButton.tsx · UploadCall.tsx
      myspace/
        FileCard.tsx
      upload/
        UploadForm.tsx
      welcome/
        LoginForm.tsx · RegisterForm.tsx
      download/
        DownloadForm.tsx
```

---

## Variables d'environnement requises

```env
VITE_API_URL=http://localhost:3000/api/v1
```
