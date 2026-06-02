# CHANGELOG5 - feat/api (audit US01 — corrections architecture) - front

**Sprint step** : STEP 5 - Audit US01 — migration store, types, messages centralisés, dead code  
**Branche** : `feat/api`

**Objectif** : Corriger les violations d'architecture (service direct dans page, état API local), centraliser les messages d'erreur upload, typer l'état local `UploadButton`, supprimer le dead code dans `TagComponent`.

---

[1. Ce qui est en place](#1-ce-qui-est-en-place)
[2. Choix techniques](#2-choix-techniques)
[a. loadFiles / deleteFile dans fileStore](#a-loadfiles--deletefile-dans-filestore)
[b. UploadingFile — type local vs store](#b-uploadingfile--type-local-vs-store)
[c. Stale closure UploadForm](#c-stale-closure-uploadform)
[d. TagComponent — dead code datalist](#d-tagcomponent--dead-code-datalist)
[3. Structure des fichiers notables](#3-structure-des-fichiers-notables)
[4. Résultats des tests](#4-résultats-des-tests)

---

## 1. Ce qui est en place

| Thème | US | Ce qui est opérationnel |
| :--- | :--- | :--- |
| **fileStore — loadFiles / deleteFile** | US01 | Actions async dans le store ; `MySpacePage` migré — plus d'import `fileService` direct |
| **UploadingFile type** | US01 | Interface dans `file.types.ts` — `useState<UploadingFile \| null>` dans `UploadButton` ; `useState<any>` supprimé |
| **ERROR_MESSAGES.UPLOAD** | US01 | `FILE_TOO_LARGE`, `INVALID_EXTENSION(ext)` dans `constants/error-messages.ts` — zéro string inline dans `validateFile` |
| **UploadForm stale closure** | US01 | `shareToken` lu via `useFileStore.getState().shareToken` après `await upload()` — évite la valeur figée au moment du rendu |
| **TagComponent cleanup** | US01 | Dead code retiré : `onChange` sur `<datalist>`, `onClick` sur `<option>`, `console.log` ; logique `showAddButton` corrigée |
| **Tests fileStore** | — | `fileStore.spec.ts` réécrit : dead tests `uploadingFile` supprimés, +4 tests `loadFiles` / `deleteFile` |
| **Tests UploadButton** | — | `UploadButton.spec.tsx` réécrit pour état local — mock store supprimé |

---

## 2. Choix techniques

### a. loadFiles / deleteFile dans fileStore

`MySpacePage` appelait `fileService.getMyFiles()` directement (violation `views → stores → services`). Les actions sont maintenant dans `fileStore` : `loadFiles` set `isLoading` + `error`, `deleteFile` retire le fichier de la liste si succès. `MySpacePage` lit `error` via le store et l'affiche via `<Callout>`.

### b. UploadingFile — type local vs store

L'état de sélection de fichier (`file`, `name`, `error`) est **UI pur** : il n'a de sens que pendant l'interaction dans `UploadButton`, avant soumission. Il reste donc en `useState` local. L'interface `UploadingFile` est définie dans `file.types.ts` (non dans le composant) pour être réutilisable si besoin, mais n'entre pas dans le store.

### c. Stale closure UploadForm

Après `await upload()`, le `shareToken` lu depuis la déstructuration du store peut être `null` (valeur capturée au moment du rendu). La correction `useFileStore.getState().shareToken` lit l'état courant du store à l'instant de la lecture — contournement standard pour les fermetures asynchrones avec Zustand.

### d. TagComponent — dead code datalist

`onChange` sur `<datalist>` et `onClick` sur `<option>` ne déclenchent pas d'événement dans les navigateurs modernes — les deux handlers étaient silencieusement ignorés. La logique de sélection est concentrée dans le seul `onChange` de l'`<input>`.

---

## 3. Structure des fichiers notables

```
src/stores/fileStore.ts             # + loadFiles(), deleteFile(id) — IFileActions mis à jour
src/types/file.types.ts             # + interface UploadingFile
src/constants/error-messages.ts     # + UPLOAD: { FILE_TOO_LARGE, INVALID_EXTENSION(ext) }
src/views/pages/MySpacePage.tsx     # migré store — plus d'import fileService
src/views/components/shared/
├── UploadButton.tsx                # validateFile → ERROR_MESSAGES, useState<UploadingFile|null>
├── UploadButton.spec.tsx           # réécrit — local state, 4 cas
└── TagComponent.tsx                # dead code supprimé, showAddButton corrigé
src/views/components/upload/
└── UploadForm.tsx                  # stale closure fix (getState().shareToken)
```

---

## 4. Résultats des tests

| Suite | Outil | Tests | Statut |
| :--- | :--- | :--- | :--- |
| Unitaire | Vitest | 186/186 | ✅ |
