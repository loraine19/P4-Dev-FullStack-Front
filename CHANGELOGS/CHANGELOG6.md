# CHANGELOG 6 — Audit types & tagStore câblage

## Refactoring — `FileItem` → `FileItemDto` (types/file.types.ts)

**Problème** : `interface FileItem` et `class FileItem` portaient le même nom, forçant des alias partout (`FileItem as FileItemDto`, `FileItem as FileItemEntity`).

**Règle §11** : l'interface = shape brute API → suffixe `Dto`. La classe entité garde le nom métier.

**Fichiers modifiés :**
- `types/file.types.ts` : `interface FileItem` → `interface FileItemDto`
- `entities/FileItem.ts` : suppression de l'alias d'import (`{ FileItem as FileItemDto }` → `{ FileItemDto }`)
- `stores/fileStore.ts` : import `FileItemDto`
- `services/fileService.ts` : import `FileItemDto`, retours typés `FileItemDto`
- `api/fileApi.ts` : import `FileItemDto`, toutes les generics mises à jour
- `views/components/myspace/FileCard.tsx` : props typées `FileItemDto`
- `views/components/myspace/FileCard.spec.tsx` : `makeFile` retourne `FileItemDto`
- `views/pages/MySpacePage.tsx` : suppression de l'alias `FileItem as FileItemEntity` — import direct `{ FileItem }` (classe) + `type { FileItemDto }`

---

## Feature — `tagStore.removeTag()` câblé à l'API

**Avant** : `removeTag(id)` faisait uniquement un `filter()` local — aucun appel API.

**Après** : appelle `tagService.remove(id)` puis filtre localement si succès. En cas d'erreur, positionne `errorTags`.

**Interface** : signature corrigée `void` → `Promise<void>`.

**Fichiers modifiés :**
- `stores/tagStore.ts` : `removeTag` async, appel `tagService.remove(id)`, interface `ITagActions` mise à jour
- `stores/tagStore.spec.ts` : mock `remove` ajouté, test 4.3.1 mis en `await`, test 4.3.2 ajouté (cas erreur API)

---

## Tests

| Suite       | Avant | Après | Delta |
| :---------- | :---: | :---: | :---: |
| tagStore    |   4   |   5   |  +1   |
| **Total**   | **188** | **189** | **+1** |
