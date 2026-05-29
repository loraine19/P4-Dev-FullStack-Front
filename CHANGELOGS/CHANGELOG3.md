# CHANGELOG3 - feat/api (wiring métier) - front

**Sprint step** : STEP 4 - US01, US02, US05, US06, US07, US08 (branchement API réelle)
**Branche** : `feat/api` (depuis `feat/auth`)

**Objectif** : Brancher toutes les pages et composants UI sur l'API back réelle - supprimer les données mock, implémenter les services typés (files, tags, download), restructurer les utilitaires en couches claires (infrastructure / constants / entities).

---

[1. Ce qui est en place](#1-ce-qui-est-en-place)
[2. Choix techniques](#2-choix-techniques)
[a. Couche infrastructure](#a-couche-infrastructure)
[b. Couche constants](#b-couche-constants)
[c. Couche entities](#c-couche-entities)
[d. Composants forms/](#d-composants-forms)
[e. Services - enveloppe API](#e-services---enveloppe-api)
[f. Download - stream sans proxy](#f-download---stream-sans-proxy)
[g. Mock data supprimée](#g-mock-data-supprimée)
[3. Résultats](#3-résultats)

---

## 1. Ce qui est en place

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

## 2. Choix techniques

### a. Couche infrastructure

`src/utils/tokenStorage.ts` supprimé - déplacé vers `src/infrastructure/tokenStorage.ts`.
Interface `ITokenStorage` + classe `TokenStorage` (localStorage) - swap possible sans modifier les consommateurs.

### b. Couche constants

`src/utils/authValidation.ts` supprimé - remplacé par `src/constants/validationRules.ts`.
Export `RULES` : factory functions `required`, `email`, `minLen`, `matches` - typage `Rule` depuis `fieldValidation`.

### c. Couche entities

`src/entities/FileItem.ts` - classe métier wrappant le DTO `FileItem` du back.
Méthodes : `isExpired()`, `daysRemaining()`, `displaySize()` (B/KB/MB/GB), `displayName()`.

### d. Composants forms/

`src/views/components/shared/InputField.tsx` et `SelectField.tsx` à la racine `shared/` supprimés.
Remplacés par `src/views/components/shared/forms/InputField.tsx`, `SelectField.tsx`, `Form.tsx` - groupement cohérent.

### e. Services - enveloppe API

Toutes les réponses backend sont enveloppées `{ status, message, data }`.
Les services accèdent à `res.data.data` - `catchApiError` centralise la gestion d'erreurs Axios → retourne `ErrorMsg`.

### f. Download - stream sans proxy

`downloadApi.download()` utilise `responseType: 'blob'`.
`downloadService.download()` crée un `Blob`, génère une URL temporaire, déclenche le téléchargement via `a.click()`, révoque l'URL.
Nom de fichier extrait du header `Content-Disposition` (pattern `filename*=UTF-8''...`).

### g. Mock data supprimée

`src/utils/mockFiles.ts` supprimé - déplacé en `src/fixtures/mockFiles.ts` (non utilisé en prod, conservé pour référence).

---

## 3. Résultats

```
npm run build     0 erreur TypeScript (Vite prod 7.41s)
npx tsc --noEmit  0 erreur TypeScript
```

| Type                                                      | Statut          |
| :-------------------------------------------------------- | :-------------- |
| Build production                                          | OK              |
| Tests manuels (upload, historique, suppression, download) | Vérifiés en dev |
| Cypress E2E                                               | En attente      |
