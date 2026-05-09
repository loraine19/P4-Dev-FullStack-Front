# **CHANGELOG**

## **Branche main — Initial scaffold**

**Objectif** :
Initialiser le frontend React/Vite avec le pattern classe+interface+singleton, les stores Zustand, le routing React Router et la configuration Tailwind v4.

| Thème                 | Ce qui a été livré                                               | Commits |
| :-------------------- | :--------------------------------------------------------------- | :------ |
| Structure React       | Pages, composants, routing React Router DOM v6                   | 068f228 |
| Pattern architectural | classe + interface + singleton sur api/ services/ utils/         | 068f228 |
| Stores Zustand        | authStore, fileStore, tagsStore (double interface State+Actions) | 068f228 |
| API client            | Axios + intercepteurs Bearer + 401 redirect                      | 068f228 |
| Style                 | Tailwind CSS v4 via plugin @tailwindcss/vite                     | 068f228 |

---

## **1. Structure + routing**

**Commit** : 068f228

### **Ce qui a été mis en place**

- React 19 + TypeScript strict + Vite 8
- React Router DOM v6 : routes `/` (WelcomePage), `/download/:shareToken` (public), `/my-space` et `/upload` (ProtectedRoute)
- `ProtectedRoute` : redirige vers `/` si pas de token

### **Fichiers créés**

- `src/App.tsx`
- `src/views/pages/WelcomePage.tsx` · `UploadPage.tsx` · `MySpacePage.tsx` · `DownloadPage.tsx`
- `src/views/components/shared/Navbar.tsx` · `ProtectedRoute.tsx`
- `src/views/components/welcome/LoginForm.tsx` · `RegisterForm.tsx`
- `src/views/components/upload/UploadForm.tsx`
- `src/views/components/myspace/FileCard.tsx` · `FileList.tsx`
- `src/views/components/download/DownloadForm.tsx`

---

## **2. Pattern classe+interface+singleton**

**Commit** : 068f228

### **Ce qui a été mis en place**

- Pattern uniforme : `interface IXxx` → `class Xxx implements IXxx` → `export const xxx = new Xxx()`
- `apiClient` Axios : intercepteur requête (Bearer token) + intercepteur réponse (401 → `tokenStorage.remove()` + redirect `/`)
- API : `userApi`, `fileApi`, `downloadApi`, `tagsApi`
- Services : `UserService`, `FilesService`, `DownloadService`
- Utilitaires : `TokenStorage` (clé `access_token` localStorage)

### **Fichiers créés**

- `src/api/apiClient.ts` · `userApi.ts` · `fileApi.ts` · `downloadApi.ts` · `tagsApi.ts`
- `src/services/UserService.ts` · `FilesService.ts` · `DownloadService.ts`
- `src/utils/tokenStorage.ts`
- `src/types/user.types.ts` · `file.types.ts` · `tag.types.ts`

---

## **3. Stores Zustand**

**Commit** : 068f228

### **Ce qui a été mis en place**

- Pattern double interface : `IXxxState` + `IXxxActions` → `create<IXxxState & IXxxActions>()`
- `authStore` : `token`, `setToken()`, `clearAuth()`
- `fileStore` : `files[]`, `setFiles()`, `addFile()`, `removeFile()`
- `tagsStore` : `tags[]`, `setTags()`, `addTag()`, `removeTag()`

### **Fichiers créés**

- `src/stores/authStore.ts`
- `src/stores/fileStore.ts`
- `src/stores/tagsStore.ts`

---

## **Récapitulatif final**

| Thème                              | Statut |
| :--------------------------------- | :----- |
| Structure React + routing          | ✅     |
| Pattern classe+interface+singleton | ✅     |
| API client Axios (Bearer + 401)    | ✅     |
| Stores Zustand (double interface)  | ✅     |
| Tailwind CSS v4                    | ✅     |
| .env.example + README              | ✅     |

---

## **Branche feat/auth — Auth hybride (cookie httpOnly + Bearer)**

**Objectif** :
Adapter le frontend à l'auth hybride : mode web (cookie httpOnly, pas de localStorage) et mode mobile (Bearer depuis localStorage).

| Thème       | Ce qui a été livré                                   | Commits |
| :---------- | :--------------------------------------------------- | :------ |
| apiClient   | withCredentials: true                                | —       |
| UserService | stocke token seulement si isMobile                   | —       |
| authStore   | ajout user + isAuthenticated                         | —       |
| Types       | LoginPayload + isMobile, AuthResponse user optionnel | —       |

---

## **1. apiClient + UserService hybride**

**Commit** : —

### **Ce qui a été mis en place**

- `withCredentials: true` sur l'instance Axios (envoie cookie httpOnly automatiquement en mode web)
- `UserService.login()` : stocke `access_token` en localStorage **uniquement** si `isMobile: true`
- `UserService.logout()` : appel `POST /auth/logout` + efface localStorage + reset store
- Types mis à jour : `LoginPayload` + `isMobile?`, `AuthResponse` + `user: UserPublic`, `access_token?` optionnel

### **Fichiers modifiés**

- `src/api/apiClient.ts`
- `src/services/UserService.ts`
- `src/types/user.types.ts`

---

## **2. authStore enrichi**

**Commit** : —

### **Ce qui a été mis en place**

- Ajout `user: UserPublic | null` et `isAuthenticated: boolean` dans `IAuthState`
- Actions `setUser()` + `clearAuth()` (efface token + user + localStorage)

### **Fichiers modifiés**

- `src/stores/authStore.ts`

---

## **Récapitulatif final**

| Thème                             | Statut |
| :-------------------------------- | :----- |
| apiClient withCredentials         | —      |
| UserService login hybride         | —      |
| authStore user + isAuthenticated  | —      |
| Types LoginPayload + AuthResponse | —      |
