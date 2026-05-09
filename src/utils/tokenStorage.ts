/* ITOKEN STORAGE INTERFACE */
interface ITokenStorage {
  get(key?: string): string | null;
  set(token: string, key?: string): void;
  remove(key?: string): void;
}

/* TOKEN STORAGE */
// localStorage implementation - swap class to switch to cookies
class TokenStorage implements ITokenStorage {
  private readonly key = 'access_token';

  /* GET */
  get(key?: string) {
    return localStorage.getItem(key || this.key);
  }

  /* SET */
  set(token: string, key?: string) {
    localStorage.setItem(key || this.key, token);
  }

  /* REMOVE */
  remove(key?: string) {
    localStorage.removeItem(key || this.key);
  }
}

export const tokenStorage = new TokenStorage();
