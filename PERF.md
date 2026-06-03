# PERF.md

## Tests de performance et métriques DataShare Frontend

---

# 1. Contexte

| Paramètre          | Valeur                                                          |
| :----------------- | :-------------------------------------------------------------- |
| Outil de build     | **Vite 8 + Rolldown**                                          |
| Date               | 28/05/2026                                                      |
| Stack              | React 19, React Router DOM v7, Zustand 5, Axios, Tailwind CSS 4 |
| Environnement      | Local (Chromebook Penguin, env dev)                             |
| Build de référence | `npm run build` - `dist/` du 25/05/2026                        |
| Tests E2E          | Cypress 13.17.0 - 7 fichiers, 26 tests                         |

---

# 2. Budget performance - Build Vite

Build de production réalisé avec `npm run build` (Vite + Rolldown) :

| Fichier             | Taille brute | Taille gzip |
| :------------------ | :----------: | :---------: |
| `dist/index.html`   |   0.45 kB    |   0.29 kB   |
| `dist/assets/*.css` |   18.33 kB   | **4.92 kB** |
| `dist/assets/*.js`  |   ~310 kB    | **~95 kB**  |

**Temps de build :** ~5s (Vite Rolldown, environnement local)

✅ **Chunk JS sous 500 kB** : 4 icônes Material Symbols en SVGs inline (`Icons.tsx`), zéro dépendance externe dédiée aux icônes.

## 1. Commande

- npm run build

\# Output → dist/

---

# 3. Analyse du bundle

## 1. Composition du bundle JS (~510 kB minifié)

| Contributeur          | Estimation | Note                                  |
| :-------------------- | :--------: | :------------------------------------ |
| React 19 + React DOM |  ~140 kB  | Framework UI                          |
| React Router DOM v7   |  ~50 kB   | Routing SPA                           |
| Axios                 |  ~15 kB   | Client HTTP                           |
| Zustand               |   ~5 kB   | State management                      |
| Icônes SVG inline     |   < 1 kB   | 4 icônes dans `shared/Icons.tsx`      |
| Code applicatif       |  ~100 kB  | Vues, composants, stores, API clients |

## 2. Piste d'optimisation principale

| Priorité | Problème                        | Action                                                                  |
| :------- | :------------------------------ | :---------------------------------------------------------------------- |
| Basse    | Bundle JS > 300 kB              | Lazy loading des routes avec `React.lazy()` + `Suspense`               |
| Future   | Pas de code splitting par route | `react-router-dom` + `lazy()` - réduirait le bundle initial à ~150 kB |

**Exemple de lazy loading :**

`const MySpacePage = React.lazy(() => import('./pages/MySpacePage'));`  
`const DownloadPage = React.lazy(() => import('./pages/DownloadPage'));`

// Dans le routeur :

`<Suspense fallback={<div>Chargement...</div>}>`  
 `<Route path="/myspace" element={<MySpacePage />} />`  
`</Suspense>`

---

# 4. Performance E2E Cypress

Les tests Cypress mesurent indirectement les temps de réponse perçus par l'utilisateur.

| Parcours         | Fichier                      | Tests  | Comportement vérifié                 |
| :--------------- | :--------------------------- | :----: | :----------------------------------- |
| Authentification | `01-auth.cy.ts`              |   7    | Register → Login → accès protégé     |
| Upload           | `02-upload.cy.ts`            |   5    | Upload succès + extension interdite |
| Espace personnel | `03-myspace.cy.ts`           |   2    | Liste fichiers + suppression        |
| Download public  | `04-download.cy.ts`          |   4    | Stream via shareToken                |
| Download protégé | `05-download-password.cy.ts` |   3    | Bon/mauvais mot de passe             |
| Upload anonyme   | `06-upload-anon.cy.ts`       |   1    | Sans authentification                |
| Tags             | `07-tags.cy.ts`              |   4    | CRUD tags                            |
| **Total**        |                              | **26** | **0 erreur**                         |

**Temps de réponse API observés via Cypress (`cy.intercept()`) :**

| Endpoint                      | Temps observé | Note                      |
| :---------------------------- | :-----------: | :------------------------ |
| POST /auth/login              |   ~260 ms    | bcrypt.compare - attendu |
| POST /files (upload)          |   ~100 ms    | Multer + Prisma INSERT   |
| GET /files (liste)            |    ~25 ms    | SELECT filtré userId      |
| GET /download/:token (stream) |    ~31 ms    | Lecture disque + stream  |

## Commandes

\# prérequis : back + front démarrés

- npm run cy:run \# headless - 26 tests
- npm run cy:open \# interactif

---

# 5. Recommandations

| Priorité | Problème                                 | Action suggérée                                |
| :------- | :--------------------------------------- | :--------------------------------------------- |
| Basse    | Bundle JS > 300 kB                       | Lazy loading routes avec `React.lazy()`        |
| Future   | Pas de monitoring performance navigateur | Intégrer Lighthouse CI en pipeline CI/CD       |
| Future   | Pas de code splitting par feature        | Route-based code splitting avec `React.lazy()` |

Référence build Vite : `dist/` - `npm run build`  
Référence tests E2E : `cypress/` - `npm run cy:run`
