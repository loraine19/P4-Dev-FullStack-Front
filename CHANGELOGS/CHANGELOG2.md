# CHANGELOG2 - feat/auth - front

**Sprint step** : STEP 3 - US03/US04 (shell complet + auth front end-to-end)
**Branche** : `feat/auth`

**Objectif** : Shell React complet - routing protégé, auth hybride cookie/Bearer branchée et testée manuellement, bibliothèque de composants UI, workflow upload, MySpace avec mock data. Cypress prévu pour clore l'étape.

---

[1. Ce qui est en place](#1-ce-qui-est-en-place)
[2. Choix techniques](#2-choix-techniques)
[a. Routing - trois niveaux d'accès](#a-routing---trois-niveaux-daccès)
[b. Auth hybride - comportement complet](#b-auth-hybride---comportement-complet)
[c. Upload - Chrome-first + fallback](#c-upload---chrome-first--fallback)
[d. MySpace - découplé du backend](#d-myspace---découplé-du-backend)
[3. Variables d'environnement requises](#3-variables-denvironnement-requises)

---

## 1. Ce qui est en place

| Thème            | Ce qui est opérationnel                                                                                        |
| :--------------- | :------------------------------------------------------------------------------------------------------------- |
| Routing          | `ConfigPage` (shell public), `ProtectedRoute` (`/my-space`), `UploadRoute` (`/upload`)                         |
| Auth end-to-end  | `register` et `login` branchés et testés manuellement - cookie httpOnly (web) + Bearer localStorage (mobile)   |
| Navbar dynamique | CTA `Se connecter` / `Mon espace` selon `isAuthenticated`                                                      |
| Composants UI    | `Button`, `InputField`, `SelectField`, `Callout`, `SwitchText`, `TagComponent`, `PageHeader`                   |
| Upload workflow  | `UploadCall` + `UploadButton` - `showOpenFilePicker` Chrome-first + fallback `input[type=file]`                |
| MySpace UI       | `FileCard`, `Switch` (filtres), `ContextMenu` (actions), `Sidebar` responsive - données mock                   |
| Download UI      | `DownloadForm` - champ password conditionnel                                                                   |
| CSS              | Shells desktop/mobile, cartes, formulaires, sidebar responsive, menu contextuel - centralisés dans `index.css` |
| Tests manuels    | Register + login + logout vérifiés manuellement en dev                                                         |
| Cypress          | ⏳ Prévu - clôture de l'étape (register, login, logout, accès protégé)                                         |

---

## 2. Choix techniques

### a. Routing - trois niveaux d'accès

```
ConfigPage (public shell)
  ├── WelcomePage /
  ├── DownloadPage /download/:shareToken
  └── UploadRoute /upload → UploadPage (fichier en store requis)
ProtectedRoute
  └── MySpacePage /my-space (isAuthenticated requis)
```

`UploadRoute` vérifie qu'un fichier est sélectionné dans le store avant d'afficher la page - sinon redirige vers `/`.

### b. Auth hybride - comportement complet

- `withCredentials: true` sur Axios - cookie httpOnly envoyé automatiquement (web)
- `authService.login()` détecte `isMobile` via `navigator.userAgent` et stocke `access_token` en localStorage uniquement si mobile
- Succès register → switch vers `LoginForm` (pas de redirect - UX délibérée : l'utilisateur doit se connecter explicitement)
- Intercepteur 401 → `tokenStorage.remove()` + redirect `/`

### c. Upload - Chrome-first + fallback

`showOpenFilePicker` utilisé en priorité (meilleure UX Chrome/Edge).  
Fallback sur `input[type=file]` contrôlé si l'API n'est pas disponible (Firefox, Safari).  
Validation locale (taille max, extensions) avant navigation vers `/upload`.

### d. MySpace - découplé du backend

Données mock centralisées (`mockFiles.ts`) - `FILE_STATUS as const`, `IFile`, `TFileStatus`.  
`MySpacePage` orchestre le filtrage et le mapping ; `FileCard` est purement présentatif.  
Sidebar responsive : comportement distinct desktop (fixe) / mobile (overlay).

---

## 3. Variables d'environnement requises

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_ANONYMOUS_UPLOAD=true
```
