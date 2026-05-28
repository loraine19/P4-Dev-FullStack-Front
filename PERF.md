- # **PERF.md \-**

## **Tests de performance et métriques DataShare Frontend**

---

[1\. Contexte](#1.-contexte)

[2\. Budget performance \- Build Vite](#2.-budget-performance---build-vite)

[Commande](#commande)

[3\. Analyse du bundle](#3.-analyse-du-bundle)

[Composition du bundle JS (\~510 kB minifié)](<#composition-du-bundle-js-(~510-kb-minifié)>)

[Piste d'optimisation principale](#piste-d'optimisation-principale)

[4\. Performance E2E Cypress](#4.-performance-e2e-cypress)

[Commandes](#commandes)

[5\. Recommandations](#5.-recommandations)

#

# 1\. Contexte {#1.-contexte}

| Paramètre          | Valeur                                                          |
| :----------------- | :-------------------------------------------------------------- |
| Outil de build     | **Vite 8 \+ Rolldown**                                          |
| Date               | 28/05/2026                                                      |
| Stack              | React 19, React Router DOM v7, Zustand 5, Axios, Tailwind CSS 4 |
| Environnement      | Local (Chromebook Penguin, env dev)                             |
| Build de référence | `npm run build` \- `dist/` du 25/05/2026                        |
| Tests E2E          | Cypress 15.15.0 \- 7 fichiers, 26 tests                         |

---

# 2\. Budget performance \- Build Vite {#2.-budget-performance---build-vite}

Build de production réalisé avec `npm run build` (Vite \+ Rolldown) :

| Fichier             | Taille brute |  Taille gzip  |
| :------------------ | :----------: | :-----------: |
| `dist/index.html`   |   0.45 kB    |    0.29 kB    |
| `dist/assets/*.css` |   18.33 kB   |  **4.92 kB**  |
| `dist/assets/*.js`  |  509.83 kB   | **156.71 kB** |

**Temps de build :** \~5s (Vite Rolldown, environnement local)

⚠️ **Avertissement Vite** : le chunk JS dépasse 500 kB minifié. La taille gzip (156 kB) reste acceptable pour un réseau haut débit.

1. ## Commande {#commande}

- npm run build

\# Output → dist/

---

#

# 3\. Analyse du bundle {#3.-analyse-du-bundle}

1. ## Composition du bundle JS (\~510 kB minifié) {#composition-du-bundle-js-(~510-kb-minifié)}

| Contributeur                         | Estimation | Note                                            |
| :----------------------------------- | :--------: | :---------------------------------------------- |
| React 19 \+ React DOM                |  \~140 kB  | Framework UI                                    |
| React Router DOM v7                  |  \~50 kB   | Routing SPA                                     |
| Axios                                |  \~15 kB   | Client HTTP                                     |
| Zustand                              |   \~5 kB   | State management                                |
| @project-lary/react-material-symbols |  \~200 kB  | Icônes Material Symbols (bibliothèque complète) |
| Code applicatif                      |  \~100 kB  | Vues, composants, stores, API clients           |

2. ## Piste d'optimisation principale {#piste-d'optimisation-principale}

| Priorité | Problème                           | Action                                                                   |
| :------- | :--------------------------------- | :----------------------------------------------------------------------- |
| Basse    | Bundle JS \> 500 kB                | Lazy loading des routes avec `React.lazy()` \+ `Suspense`                |
| Basse    | Icônes Material Symbols (\~200 kB) | Importer uniquement les icônes utilisées si l'API le permet              |
| Future   | Pas de code splitting par route    | `react-router-dom` \+ `lazy()` \- réduirait le bundle initial à \~250 kB |

**Exemple de lazy loading :**

`const MySpacePage = React.lazy(() => import('./pages/MySpacePage'));`  
`const DownloadPage = React.lazy(() => import('./pages/DownloadPage'));`

// Dans le routeur :

`<Suspense fallback={<div>Chargement...</div>}>`  
 `<Route path="/myspace" element={<MySpacePage />} />`  
`</Suspense>`

---

#

# 4\. Performance E2E Cypress {#4.-performance-e2e-cypress}

Les tests Cypress mesurent indirectement les temps de réponse perçus par l'utilisateur.

| Parcours         | Fichier                      | Tests  | Comportement vérifié                 |
| :--------------- | :--------------------------- | :----: | :----------------------------------- |
| Authentification | `01-auth.cy.ts`              |   7    | Register → Login → accès protégé     |
| Upload           | `02-upload.cy.ts`            |   5    | Upload succès \+ extension interdite |
| Espace personnel | `03-myspace.cy.ts`           |   2    | Liste fichiers \+ suppression        |
| Download public  | `04-download.cy.ts`          |   4    | Stream via shareToken                |
| Download protégé | `05-download-password.cy.ts` |   3    | Bon/mauvais mot de passe             |
| Upload anonyme   | `06-upload-anon.cy.ts`       |   1    | Sans authentification                |
| Tags             | `07-tags.cy.ts`              |   4    | CRUD tags                            |
| **Total**        |                              | **26** | **0 erreur**                         |

**Temps de réponse API observés via Cypress (`cy.intercept()`) :**

| Endpoint                      | Temps observé | Note                      |
| :---------------------------- | :-----------: | :------------------------ |
| POST /auth/login              |   \~260 ms    | bcrypt.compare \- attendu |
| POST /files (upload)          |   \~100 ms    | Multer \+ Prisma INSERT   |
| GET /files (liste)            |    \~25 ms    | SELECT filtré userId      |
| GET /download/:token (stream) |    \~31 ms    | Lecture disque \+ stream  |

## Commandes {#commandes}

\# prérequis : back \+ front démarrés

- npm run cy:run \# headless \- 26 tests
- npm run cy:open \# interactif

---

#

# 5\. Recommandations {#5.-recommandations}

| Priorité | Problème                                 | Action suggérée                                |
| :------- | :--------------------------------------- | :--------------------------------------------- |
| Basse    | Bundle JS \> 500 kB                      | Lazy loading routes avec `React.lazy()`        |
| Basse    | Icônes Material Symbols volumineuses     | Tree-shaking ou import sélectif                |
| Future   | Pas de monitoring performance navigateur | Intégrer Lighthouse CI en pipeline CI/CD       |
| Future   | Pas de code splitting par feature        | Route-based code splitting avec `React.lazy()` |

Référence build Vite : `dist/` \- `npm run build`  
Référence tests E2E : `cypress/` \- `npm run cy:run`
