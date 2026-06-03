# MAINTENANCE.md

## DataShare Frontend

---

# 1. Procédure d'audit de sécurité

## 1. Commande

- npm audit

## 2. Résultat actuel (28/05/2026)

- 3 vulnérabilités - 1 high, 2 moderate
- Packages affectés : qs ≤6.15.1, tmp <0.2.6
- Origine : @cypress/request (dépend de qs vulnérable)

**Origine** : toutes dans `cypress` (devDependency - outil de tests E2E local).  
**Le code production (`dependencies`) ne présente aucune vulnérabilité.**

## 3. Traitement

| Contexte                                        | Action                                                            |
| :---------------------------------------------- | :---------------------------------------------------------------- |
| Vulnérabilité dans `dependencies` (production)  | Corriger immédiatement - `npm audit fix` ou mise à jour manuelle |
| Vulnérabilité dans `devDependencies` uniquement | Évaluer l'impact réel - pas d'exposition en production           |
| Fix avec breaking change (`--force`)            | Tester avant d'appliquer - vérifier la suite Vitest + Cypress   |

---

# 2. Inventaire des dépendances critiques

## 1. Production (`dependencies`)

| Package                                | Version | Rôle                                                | Risque mise à jour                                                        |
| :------------------------------------- | :------ | :-------------------------------------------------- | :------------------------------------------------------------------------ |
| `react` + `react-dom`                 | ^19.2.5 | Framework UI                                        | **Élevé** - API publique, vérifier tous les composants après mise à jour |
| `react-router-dom`                     | ^7.15.0 | Routing SPA (ProtectedRoute, UploadRoute)           | **Élevé** - API de routing peut changer, tester les parcours Cypress     |
| `axios`                                | ^1.16.0 | Client HTTP (authApi, fileApi, tagApi, downloadApi) | **Moyen** - vérifier les interceptors et la gestion des cookies          |
| `zustand`                              | ^5.0.13 | State management (authStore, fileStore, tagStore)   | **Moyen** - API store stable, tester les stores après mise à jour        |
| `@project-lary/react-material-symbols` | ^0.38.0 | Icônes Material Symbols                             | **Faible** - composant visuel uniquement                                 |


## 2. Dev uniquement (`devDependencies` - pas d'impact production)

| Package                  | Version  | Rôle                                                                               |
| :----------------------- | :------- | :--------------------------------------------------------------------------------- |
| `vite`                   | ^8.0.10  | Bundler dev + build                                                               |
| `vitest`                 | ^4.1.7   | Tests unitaires (jsdom)                                                            |
| `@vitest/coverage-v8`    | ^4.1.7   | Couverture de code                                                                 |
| `cypress`                | ^15.15.0 | Tests E2E navigateur (vulnérable via `@cypress/request` - usage local uniquement) |
| `@testing-library/react` | ^16.3.2  | Utilitaires de test composants                                                     |
| `tailwindcss`            | ^4.3.0   | CSS utilitaire                                                                     |
| `typescript`             | ~6.0.2  | Compilation TypeScript                                                             |

---

# 3. Fréquence de mise à jour recommandée

| Type              | Fréquence        | Déclencheur                       | Procédure                                                           |
| :---------------- | :--------------- | :-------------------------------- | :------------------------------------------------------------------ |
| **Patch** (x.y.Z) | À chaque release | CVE, `npm audit` critique         | `npm update` → `npm audit` → `npm test`                             |
| **Minor** (x.Y.z) | Mensuelle        | Dépendance de sécurité principale | Mettre à jour + relancer Vitest + Cypress                         |
| **Major** (X.y.z) | Sur décision     | Fin de support, incompatibilité   | Lire le CHANGELOG, ouvrir une branche dédiée, tester exhaustivement |

---

# 4. Procédure de mise à jour standard

## 1. Vérifier l'état avant mise à jour

- npm audit
- npm outdated

## 2. Mettre à jour (patch/minor)

- npm update

## c.Vérifier qu'aucune régression n'est introduite

- npm test
- npm run cy:run

## d. Vérifier la compilation TypeScript

- npx tsc --noEmit

## e. Vérifier l'audit après mise à jour

- npm audit

**Règle** : une mise à jour est validée uniquement si les deux suites de tests passent à 100% et `npx tsc --noEmit` retourne 0 erreur.

---

# 5. Procédures spécifiques par package

## 1. `react` + `react-dom` - framework UI

- Avant mise à jour : lire les notes de version React (Breaking Changes)
- Après mise à jour : relancer tous les tests Vitest (`npm test`) + Cypress (`npm run cy:run`)
- Vérifier en priorité les composants utilisant les hooks (`useState`, `useEffect`, `useContext`)

## 2. `react-router-dom` - routing SPA

Impacte `ProtectedRoute`, `UploadRoute`, `ConfigPage` et les `<Navigate>`.

- npm update react-router-dom

\# Tester les parcours d'accès protégé

- npm run cy:run

## 3. `axios` - client HTTP

Impacte directement tous les modules API (`authApi`, `fileApi`, `tagApi`, `downloadApi`).

- Après mise à jour, vérifier les interceptors dans `src/api/axiosInstance.ts`
- Tester login (cookie httpOnly), upload multipart, download stream

* npm update axios
* npm test
* npm run cy:run

## 4. `zustand` - state management

- Après mise à jour, tester `authStore`, `fileStore`, `tagStore`
- Vérifier la persistance du token et la réhydratation du store

* npm update zustand
* npm test

## `cypress` - tests E2E
Vulnérabilités présentes (qs, tmp) - uniquement utilisé en local pour les tests E2E. Pas d'exposition en production.

- Ne pas appliquer `npm audit fix --force` sans vérifier que les specs Cypress passent toujours
- `npm audit fix` (sans `--force`) peut corriger les vulnérabilités sans breaking change

---

# 6. Surveillance en production

| Signal                                                                  | Action                                         |
| :---------------------------------------------------------------------- | :--------------------------------------------- |
| `npm audit` retourne une vulnérabilité **critical** dans `dependencies` | Corriger dans les 24h, ouvrir une PR dédiée    |
| `npm audit` retourne **high** dans `dependencies`                       | Planifier la correction dans la semaine        |
| `npm audit` retourne uniquement `devDependencies`                       | Documenter, planifier à la prochaine itération |
| Fin de support LTS Node.js                                              | Mettre à jour avant la date de fin de support  |

Référence LTS Node.js : [nodejs.org/en/about/releases](https://nodejs.org/en/about/releases)
