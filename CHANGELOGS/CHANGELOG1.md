# CHANGELOG1 - main - front

**Sprint step** : STEP 2 + STEP 3 - Initialisation + US03/US04 (auth hybride front)
**Branche** : `main`

**Objectif** : Socle React/Vite - pattern classe+interface+singleton, stores Zustand, routing protégé, et adaptation à l'auth hybride cookie httpOnly (web) + Bearer (mobile).

---

[1. Ce qui est en place](#1-ce-qui-est-en-place)
[2. Choix techniques](#2-choix-techniques)
[a. Pattern classe+interface+singleton](#a-pattern-classeinterfacesingleton)
[b. Auth hybride](#b-auth-hybride)
[c. FieldValidator - pas de hook de validation](#c-fieldvalidator---pas-de-hook-de-validation)
[d. serviceHelpers - gestion erreurs uniforme](#d-servicehelpers---gestion-erreurs-uniforme)
[e. Stores Zustand - double interface](#e-stores-zustand---double-interface)
[3. Variables d'environnement requises](#3-variables-denvironnement-requises)

---

## 1. Ce qui est en place

| Thème           | Ce qui est opérationnel                                               |
| :-------------- | :-------------------------------------------------------------------- |
| Routing         | React Router DOM v6 - 4 routes, `ProtectedRoute`, `ConfigPage` layout |
| Pattern API     | `class XxxApi implements IXxxApi` → `export const xxxApi` (singleton) |
| Pattern service | `class XxxService implements IXxxService` → `export const xxxService` |
| Stores Zustand  | `authStore`, `fileStore`, `tagStore` - double interface State+Actions |
| Auth hybride    | `withCredentials: true` + token localStorage si `isMobile` uniquement |
| Validation      | `FieldValidator<T>` - classe stateless, sans hook                     |
| Gestion erreurs | `catchApiError` / `getApiError` - helpers dans `serviceHelpers.ts`    |
| Styles          | Tailwind CSS v4 via `@tailwindcss/vite`                               |

---

## 2. Choix techniques

### a. Pattern classe+interface+singleton

Chaque couche expose une interface puis une implémentation, exportée comme singleton :

```ts
interface IFileApi { ... }
class FileApi implements IFileApi { ... }
export const fileApi = new FileApi();
```

Avantage : mockable en test, typage fort, pas de state dans la couche API.

### b. Auth hybride

`withCredentials: true` sur l'instance Axios - le cookie httpOnly est envoyé automatiquement (web).
`authService.login()` stocke `access_token` en localStorage **uniquement** si `isMobile: true`.
L'intercepteur 401 efface le token et redirige vers `/` dans les deux cas.

### c. FieldValidator - pas de hook de validation

`FieldValidator<T>` est une classe pure instanciée au niveau module (pas dans le composant).
Pas de hook (`useFieldValidation`) - les hooks ajoutent un cycle de vie React inutile pour de la validation stateless.

### d. serviceHelpers - gestion erreurs uniforme

`catchApiError(error)` - wraps les erreurs réseau/axios en `ErrorMsg`.
`getApiError(data)` - lit `ApiResponseEnvelope.status === "error"` et retourne `ErrorMsg | null`.
Les services ne lèvent jamais d'exception - ils retournent `ErrorMsg | T`.

### e. Stores Zustand - double interface

```ts
interface IDomainState { ... }
interface IDomainActions { ... }
const useDomainStore = create<IDomainState & IDomainActions>(...)
```

`useShallow` pour sélectionner plusieurs champs à la fois, sélecteur simple sinon.

---

## 3. Variables d'environnement requises

```env
VITE_API_URL=http://localhost:3000/api/v1
```
