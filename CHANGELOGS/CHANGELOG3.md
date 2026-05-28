# CHANGELOG - feat/api (wiring métier front)

**Sprint step** : STEP 4 - US01, US02, US05, US06, US07, US08 (branchement API réelle)
**Branche** : `feat/api` (depuis `feat/auth`)

**Objectif** : Brancher toutes les pages et composants UI sur l'API back réelle - supprimer les données mock, implémenter les services typés (files, tags, download), restructurer les utilitaires en couches claires (infrastructure / constants / entities).

---

## Ce qui est en place

| Thème                          | US   | Ce qui est opérationnel                                                                                |
| :----------------------------- | :--- | :----------------------------------------------------------------------------------------------------- |
| MySpace - liste réelle         | US05 | `MySpacePage` consomme `fileService.getMyFiles()` - `GET /files` - filtres ALL / ACTIVE / EXPIRED      |
| MySpace - suppression          | US06 | `FileCard` déclenche `fileStore.removeFile(id)` - `DELETE /files/:id`                                  |
| Upload - FormData multipart    | US01 | `UploadForm` construit `FormData` et soumet via `fileService.uploadFile()` - `POST /files`             |
| Upload - tags                  | US08 | `tagService.getAll()` au montage - saisie avec suggestions - IDs envoyés dans `FormData`               |
| Upload - password + expiration | US01 | Champs optionnels inclus dans le `FormData`                                                            |
| Upload anonyme                 | US07 | Route `POST /files/anonymous` - non authentifié                                                        |
| Download - métadonnées         | US02 | `DownloadForm` appelle `downloadService.getMeta(shareToken)` - affiche nom, taille, `requiresPassword` |
| Download - champ password      | US02 | Conditionnel - apparaît uniquement si `requiresPassword = true`                                        |
| Download - stream blob         | US02 | `downloadService.download(token, password?)` - blob - `URL.createObjectURL` + `a.click()`              |
| Tags - CRUD                    | US08 | `tagService.create(name)` + `tagService.remove(id)` - `POST /tags` + `DELETE /tags/:id`                |

---

## Choix techniques

### Couche infrastructure

`src/utils/tokenStorage.ts` supprimé - déplacé vers `src/infrastructure/tokenStorage.ts`.
Interface `ITokenStorage` + classe `TokenStorage` (localStorage) - swap possible sans modifier les consommateurs.

### Couche constants

`src/utils/authValidation.ts` supprimé - remplacé par `src/constants/validationRules.ts`.
Export `RULES` : factory functions `required`, `email`, `minLen`, `matches` - typage `Rule` depuis `fieldValidation`.

### Couche entities

`src/entities/FileItem.ts` - classe métier wrappant le DTO `FileItem` du back.
Méthodes : `isExpired()`, `daysRemaining()`, `displaySize()` (B/KB/MB/GB), `displayName()`.

### Composants forms/

`src/views/components/shared/InputField.tsx` et `SelectField.tsx` à la racine `shared/` supprimés.
Remplacés par `src/views/components/shared/forms/InputField.tsx`, `SelectField.tsx`, `Form.tsx` - groupement cohérent.

### Services - enveloppe API

Toutes les réponses backend sont enveloppées `{ status, message, data }`.
Les services accèdent à `res.data.data` - `catchApiError` centralise la gestion d'erreurs Axios → retourne `ErrorMsg`.

### Download - stream sans proxy

`downloadApi.download()` utilise `responseType: 'blob'`.
`downloadService.download()` crée un `Blob`, génère une URL temporaire, déclenche le téléchargement via `a.click()`, révoque l'URL.
Nom de fichier extrait du header `Content-Disposition` (pattern `filename*=UTF-8''...`).

### Mock data supprimée

`src/utils/mockFiles.ts` supprimé - déplacé en `src/fixtures/mockFiles.ts` (non utilisé en prod, conservé pour référence).

---

## Fichiers modifiés / créés / supprimés

| Fichier                                             | Action                                                                         |
| :-------------------------------------------------- | :----------------------------------------------------------------------------- |
| `src/entities/FileItem.ts`                          | Créé - classe métier FileItem                                                  |
| `src/infrastructure/tokenStorage.ts`                | Créé - déplacé depuis `src/utils/tokenStorage.ts`                              |
| `src/fixtures/mockFiles.ts`                         | Créé - déplacé depuis `src/utils/mockFiles.ts` (référence uniquement)          |
| `src/constants/validationRules.ts`                  | Créé - RULES factory, remplace `authValidation.ts`                             |
| `src/services/tagService.ts`                        | Créé - `getAll()`, `create(name)`, `remove(id)`                                |
| `src/services/fileService.ts`                       | Modifié - `getMyFiles()`, `uploadFile(FormData)`, `deleteFile(id)`             |
| `src/services/downloadService.ts`                   | Modifié - `getMeta(shareToken)`, `download(shareToken, password?)` blob stream |
| `src/services/authService.ts`                       | Modifié - import `tokenStorage` depuis `infrastructure/`                       |
| `src/stores/authStore.ts`                           | Modifié - import `tokenStorage` depuis `infrastructure/`                       |
| `src/api/fileApi.ts`                                | Modifié - `getAll()`, `upload(FormData)`, `remove(id)`                         |
| `src/api/tagApi.ts`                                 | Modifié - `getAll()`, `create(name)`, `remove(id)`                             |
| `src/api/downloadApi.ts`                            | Modifié - `getMeta(token)`, `download(token, password?)` responseType blob     |
| `src/api/apiClient.ts`                              | Modifié - ajustements baseURL + withCredentials                                |
| `src/types/file.types.ts`                           | Modifié - ajout type `DownloadMeta`                                            |
| `src/views/pages/MySpacePage.tsx`                   | Modifié - `fileService.getMyFiles()`, `useFileStore`, filtres actif/expiré     |
| `src/views/pages/DownloadPage.tsx`                  | Modifié - `shareToken` depuis `useParams`                                      |
| `src/views/components/upload/UploadForm.tsx`        | Modifié - `tagService.getAll()` au montage, `FormData` multipart               |
| `src/views/components/download/DownloadForm.tsx`    | Modifié - `getMeta()` + `download()` blob, password conditionnel               |
| `src/views/components/myspace/FileCard.tsx`         | Modifié - expiry text, icone cadenas, context menu                             |
| `src/views/components/welcome/LoginForm.tsx`        | Modifié - import depuis `forms/InputField`                                     |
| `src/views/components/welcome/RegisterForm.tsx`     | Modifié - import depuis `forms/InputField`                                     |
| `src/views/components/shared/forms/Form.tsx`        | Créé - wrapper form générique                                                  |
| `src/views/components/shared/forms/InputField.tsx`  | Créé - déplacé et refactorisé depuis `shared/`                                 |
| `src/views/components/shared/forms/SelectField.tsx` | Créé - déplacé depuis `shared/`                                                |
| `src/utils/authValidation.ts`                       | Supprimé - remplacé par `constants/validationRules.ts`                         |
| `src/utils/mockFiles.ts`                            | Supprimé - déplacé en `fixtures/`                                              |
| `src/utils/tokenStorage.ts`                         | Supprimé - déplacé en `infrastructure/`                                        |
| `src/views/components/shared/InputField.tsx`        | Supprimé - déplacé en `forms/`                                                 |
| `src/views/components/shared/SelectField.tsx`       | Supprimé - déplacé en `forms/`                                                 |
| `CHANGELOGS/CHANGELOG2.md`                          | Corrigé - header branche `main` → `feat/auth`                                  |

---

## Rapport de tests

```
npm run build     0 erreur TypeScript (Vite prod 7.41s)
npx tsc --noEmit  0 erreur TypeScript
```

| Type                                                      | Statut          |
| :-------------------------------------------------------- | :-------------- |
| Build production                                          | OK              |
| Tests manuels (upload, historique, suppression, download) | Vérifiés en dev |
| Cypress E2E                                               | En attente      |
