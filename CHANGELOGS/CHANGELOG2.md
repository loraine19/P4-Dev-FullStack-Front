# CHANGELOG — main

**Sprint step** : STEP 3 — US03/US04 (shell complet + auth front end-to-end)
**Branche** : `main`

**Objectif** : Shell React complet — routing protégé, auth hybride cookie/Bearer branchée et testée manuellement, bibliothèque de composants UI, workflow upload, MySpace avec mock data. Cypress prévu pour clore l'étape.

---

## Ce qui est en place

| Thème | Ce qui est opérationnel |
| :--- | :--- |
| Routing | `ConfigPage` (shell public), `ProtectedRoute` (`/my-space`), `UploadRoute` (`/upload`) |
| Auth end-to-end | `register` et `login` branchés et testés manuellement — cookie httpOnly (web) + Bearer localStorage (mobile) |
| Navbar dynamique | CTA `Se connecter` / `Mon espace` selon `isAuthenticated` |
| Composants UI | `Button`, `InputField`, `SelectField`, `Callout`, `SwitchText`, `TagComponent`, `PageHeader` |
| Upload workflow | `UploadCall` + `UploadButton` — `showOpenFilePicker` Chrome-first + fallback `input[type=file]` |
| MySpace UI | `FileCard`, `Switch` (filtres), `ContextMenu` (actions), `Sidebar` responsive — données mock |
| Download UI | `DownloadForm` — champ password conditionnel |
| CSS | Shells desktop/mobile, cartes, formulaires, sidebar responsive, menu contextuel — centralisés dans `index.css` |
| Tests manuels | Register + login + logout vérifiés manuellement en dev |
| Cypress | ⏳ Prévu — clôture de l'étape (register, login, logout, accès protégé) |

---

## Choix techniques

### Routing — trois niveaux d'accès

```
ConfigPage (public shell)
  ├── WelcomePage /
  ├── DownloadPage /download/:shareToken
  └── UploadRoute /upload → UploadPage (fichier en store requis)
ProtectedRoute
  └── MySpacePage /my-space (isAuthenticated requis)
```

`UploadRoute` vérifie qu'un fichier est sélectionné dans le store avant d'afficher la page — sinon redirige vers `/`.

### Auth hybride — comportement complet

- `withCredentials: true` sur Axios — cookie httpOnly envoyé automatiquement (web)
- `authService.login()` détecte `isMobile` via `navigator.userAgent` et stocke `access_token` en localStorage uniquement si mobile
- Succès register → switch vers `LoginForm` (pas de redirect — UX délibérée : l'utilisateur doit se connecter explicitement)
- Intercepteur 401 → `tokenStorage.remove()` + redirect `/`

### Upload — Chrome-first + fallback

`showOpenFilePicker` utilisé en priorité (meilleure UX Chrome/Edge).  
Fallback sur `input[type=file]` contrôlé si l'API n'est pas disponible (Firefox, Safari).  
Validation locale (taille max, extensions) avant navigation vers `/upload`.

### MySpace — découplé du backend

Données mock centralisées (`mockFiles.ts`) — `FILE_STATUS as const`, `IFile`, `TFileStatus`.  
`MySpacePage` orchestre le filtrage et le mapping ; `FileCard` est purement présentatif.  
Sidebar responsive : comportement distinct desktop (fixe) / mobile (overlay).

---

## Structure des fichiers notables

```
src/
  App.tsx                              — routing racine, trois niveaux d'accès
  api/
    apiClient.ts                       — Axios, withCredentials, intercepteur 401
    authApi.ts                         — IAuthApi, authApi singleton
    fileApi.ts                         — IFileApi, fileApi singleton
    tagApi.ts                          — ITagApi, tagApi singleton
    downloadApi.ts                     — IDownloadApi, downloadApi singleton
  services/
    authService.ts                     — login(), register(), logout() — isMobile détecté ici
    fileService.ts                     — getMyFiles(), uploadFile(), deleteFile()
    serviceHelpers.ts                  — catchApiError, getApiError
  stores/
    authStore.ts                       — user, isAuthenticated, isLoading, error + orchestration
    fileStore.ts                       — fichier sélectionné + liste
    tagStore.ts                        — tags (singulier)
  utils/
    tokenStorage.ts                    — TokenStorage singleton
    fieldValidation.ts                 — FieldValidator<T> classe stateless
    authValidation.ts                  — validateLoginField, validateRegisterField
    mockFiles.ts                       — FILE_STATUS, IFile, TFileStatus
  views/
    components/
      routing/
        ConfigPage.tsx                 — shell public (Navbar + Footer + Outlet)
        ProtectedRoute.tsx             — redirige vers / si non authentifié
        UploadRoute.tsx                — redirige vers / si pas de fichier en store
      shared/
        Button.tsx · InputField.tsx · SelectField.tsx
        Callout.tsx · SwitchText.tsx · TagComponent.tsx · PageHeader.tsx
        Navbar.tsx · Footer.tsx · Sidebar.tsx
        UploadCall.tsx · UploadButton.tsx
        Switch.tsx · ContextMenu.tsx
      welcome/
        LoginForm.tsx                  — validation blur + submit, redirect /my-space
        RegisterForm.tsx               — validation blur + submit, switch vers login
      upload/
        UploadForm.tsx
      myspace/
        FileCard.tsx
      download/
        DownloadForm.tsx
    pages/
      WelcomePage.tsx                  — bascule login/register via ?auth=
      MySpacePage.tsx                  — filtrage + mapping FileCard
      UploadPage.tsx
      DownloadPage.tsx
  index.css                            — tout le CSS applicatif (Tailwind + classes métier)
```

---

## Variables d'environnement requises

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_ANONYMOUS_UPLOAD=true
```
