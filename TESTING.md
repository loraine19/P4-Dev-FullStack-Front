# TESTING.md

## DataShare Frontend

---

# 1. Stratégie de tests

| Niveau         | Outil                 | Périmètre                                       | Commande         |
| :------------- | :-------------------- | :---------------------------------------------- | :--------------- |
| Unitaire       | Vitest 4.1.7 + jsdom | Stores, API clients, composants, pages, routing | `npm test`       |
| E2E navigateur | Cypress 15            | Front React → API NestJS → PostgreSQL           | `npm run cy:run` |

---

# 2. Tests unitaires - Vitest

## 1. 41 fichiers - 203/203 ✅

| N° TEST_PLAN | Suite                     | Fichier                                      | Domaine        |
| :----------: | :------------------------ | :------------------------------------------- | :------------- |
|      1       | fieldValidation           | `utils/fieldValidation.spec.ts`              | Utils          |
|      2       | authStore                 | `stores/authStore.spec.ts`                   | Store          |
|      3       | fileStore                 | `stores/fileStore.spec.ts`                   | Store          |
|      4       | tagStore                  | `stores/tagStore.spec.ts`                    | Store          |
|      -       | downloadStore             | `stores/downloadStore.spec.ts`               | Store          |
|      5       | tokenStorage              | `infrastructure/tokenStorage.spec.ts`        | Infrastructure |
|      6       | Button                    | `components/Button.spec.tsx`                 | UI             |
|      7       | Callout                   | `components/Callout.spec.tsx`                | UI             |
|      8       | InputField                | `components/forms/InputField.spec.tsx`       | UI             |
|      9       | Form                      | `components/forms/Form.spec.tsx`             | UI             |
|      10      | ProtectedRoute            | `routing/ProtectedRoute.spec.tsx`            | Routing        |
|      11      | UploadRoute               | `routing/UploadRoute.spec.tsx`               | Routing        |
|      12      | LoginForm                 | `welcome/LoginForm.spec.tsx`                 | UI             |
|      13      | WelcomePage               | `pages/WelcomePage.spec.tsx`                 | Pages          |
|      14      | authApi                   | `api/authApi.spec.ts`                        | API            |
|      15      | fileApi                   | `api/fileApi.spec.ts`                        | API            |
|      16      | tagApi                    | `api/tagApi.spec.ts`                         | API            |
|      17      | downloadApi               | `api/downloadApi.spec.ts`                    | API            |
|      18      | Footer                    | `components/Footer.spec.tsx`                 | UI             |
|      19      | Navbar                    | `components/Navbar.spec.tsx`                 | UI             |
|      20      | PageHeader                | `components/PageHeader.spec.tsx`             | UI             |
|      21      | Switch                    | `components/Switch.spec.tsx`                 | UI             |
|      22      | Sidebar                   | `components/Sidebar.spec.tsx`                | UI             |
|      23      | TagComponent              | `components/TagComponent.spec.tsx`           | UI             |
|      24      | ContextMenu               | `components/ContextMenu.spec.tsx`            | UI             |
|      25      | SelectField               | `components/forms/SelectField.spec.tsx`      | UI             |
|      26      | FileCard                  | `myspace/FileCard.spec.tsx`                  | UI             |
|      27      | RegisterForm              | `welcome/RegisterForm.spec.tsx`              | UI             |
|      28      | DownloadForm              | `download/DownloadForm.spec.tsx`             | UI             |
|      29      | UploadForm                | `upload/UploadForm.spec.tsx`                 | UI             |
|      30      | MySpacePage               | `pages/MySpacePage.spec.tsx`                 | Pages          |
|      31      | DownloadPage              | `pages/DownloadPage.spec.tsx`                | Pages          |
|      32      | UploadPage                | `pages/UploadPage.spec.tsx`                  | Pages          |
|      33      | ConfigPage                | `routing/ConfigPage.spec.tsx`                | Routing        |
|      -       | Services (hors TEST_PLAN) | `services/*.spec.ts` · `download/` · `tags/` | Services       |

## 2. Commandes

- npm test \# run all unit tests (vitest run)
- npm run test:cov \# avec couverture v8 (coverage-unit/)

---

# 3. Tests E2E - Cypress

## 1. 7 fichiers - 26/26 ✅

| Fichier                      | Flow (describe)                                    | Tests  |
| :--------------------------- | :------------------------------------------------- | :----: |
| `01-auth.cy.ts`              | Flow 1 - Auth (register, login, protected route)   |   7    |
| `02-upload.cy.ts`            | Flow 2 - Upload (success + forbidden extension)    |   5    |
| `03-myspace.cy.ts`           | Flow 3 - My space (list, delete)                   |   2    |
| `04-download.cy.ts`          | Flow 4 - Public download link                      |   4    |
| `05-download-password.cy.ts` | Flow 5 - Password-protected download               |   3    |
| `06-upload-anon.cy.ts`       | Flow 6 - Anonymous upload                          |   1    |
| `07-tags.cy.ts`              | Flow 7 - Tags (create, attach, remove)             |   4    |
| **Total**                    |                                                                | **26** |

## 2. Stratégie technique

- **Setup programmatique** : `cy.registerViaApi`, `cy.loginViaApi` via `cy.request()` - le cookie httpOnly est préservé automatiquement par Cypress pour les `cy.visit` suivants
- **Setup fichiers** : `cy.task('uploadTestFile')` - upload multipart depuis Node.js avec Bearer token (`isMobile: true`) pour éviter le cookie httpOnly dans le contexte Node
- **Vérification download** : `cy.intercept()` + `cy.wait('@download').its('response.statusCode')` - Cypress capture la réponse binaire sans vérifier le fichier physique
- **Isolation** : email unique `email-\${Date.now()}@test.local` par spec - pas de dépendance entre fichiers

## 3. Commandes

\# prérequis : back + front démarrés

- docker compose up -d \# PostgreSQL (côté back)
- npm run start:dev \# NestJS back (port 3000\)
- npm run dev \# Vite front (port 5173\)
- npm run cy:open \# mode interactif (navigateur)
- npm run cy:run \# mode headless (CI)

---

# 4. Couverture unitaire - v8

| Métrique   | Seuil | Résultat  |
| :--------- | :---: | :-------: |
| Statements | ≥ 70% | ✅ 74.73% |
| Lines      | ≥ 70% | ✅ 77.64% |
| Functions  | ≥ 70% | ✅ ~80%  |
| Branches   | ≥ 70% |   ~68%   |

Rapport HTML : `coverage-unit/lcov-report/index.html`

---

# 5. Rapports

| Rapport                           | Chemin                                 | Généré par         |
| :-------------------------------- | :------------------------------------- | :----------------- |
| Couverture unitaire Vitest (HTML) | `coverage-unit/lcov-report/index.html` | `npm run test:cov` |
| Vidéos Cypress                    | `cypress/videos/`                      | `npm run cy:run`   |

---

# 6. Critères d'acceptation

| Critère                |       Seuil        |  Résultat   |
| :--------------------- | :----------------: | :---------: |
| Tests unitaires Vitest |     100% pass      | ✅ 203/203  |
| Tests E2E Cypress      |     100% pass      |  ✅ 26/26   |
| Coverage statements    |       ≥ 70%        |  ✅ 74.73%  |
| Coverage lines         |       ≥ 70%        |  ✅ 77.64%  |
| 0 erreur TypeScript    | `npx tsc --noEmit` | ✅ 0 erreur |

---

# 7. Détail des cas de test

## 1. [📊 Plan détaillé complet](https://docs.google.com/spreadsheets/d/e/2PACX-1vQKMx-Go8curn85rzLBfdVDXZYMuyo_8tVePBiEKMCvAa8R0qwPmmR5kwxnHjEF-A0RURbUuNiYcimJ/pubhtml?gid=906604324&single=true)
