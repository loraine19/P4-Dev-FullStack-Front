# Security — P4-FRONT

## Authentication & token storage

Authentication is handled entirely by the back-end (NestJS). The front-end never issues or validates tokens.

**Web mode (default)**

The back-end sets a `httpOnly` cookie on login. `apiClient` is configured with `withCredentials: true` so the browser sends the cookie automatically on every request. The token is never readable from JavaScript.

**Mobile fallback**

When `isMobile` is detected, the `access_token` returned by the login response is stored in `localStorage` via `tokenStorage` and attached as a `Bearer` header by the Axios request interceptor. This path is not used in the standard web build.

On logout, `tokenStorage.remove()` is called to clear any stored token regardless of mode.

## Route protection

**`ProtectedRoute`** — wraps all authenticated views. Redirects to `/` if no active session is detected.

**`UploadRoute`** — wraps the upload view. Respects the `VITE_ANONYMOUS_UPLOAD` environment variable. If `false` (default), unauthenticated users are redirected; if `true`, anonymous upload is allowed.

## Environment variables

Only two variables are exposed to the browser bundle:

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the back-end API |
| `VITE_ANONYMOUS_UPLOAD` | Enables anonymous upload — set to `false` in production |

No secrets (JWT secret, database credentials, etc.) are present in the front-end. The `.env.example` ships with `VITE_ANONYMOUS_UPLOAD=false`.

## XSS

React escapes all dynamic values by default. No `dangerouslySetInnerHTML` is used in the codebase.

## Input validation

Form fields use native HTML validation attributes (`required`, `minLength`, `type`). All data is re-validated server-side by NestJS `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true`. Front-end validation is UX only and provides no security guarantee.

## 401 handling

The Axios response interceptor clears `tokenStorage` and redirects to `/` on 401 responses, except on paths listed in `publicApiPaths` (login, register) where a 401 is expected.

## Dependency audit

```
npm audit --omit=dev
```

Run before each production deployment. As of the last audit, production dependencies report 0 vulnerabilities.

One high-severity vulnerability (`GHSA-ph9p-34f9-6g65` — Path Traversal in `tmp`) exists in `devDependencies` only (pulled in by Cypress). It has no impact on the production build.
