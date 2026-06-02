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
    const debug = localStorage.getItem(key || this.key);
    alert('get token from storage: '+debug);
    return localStorage.getItem(key || this.key);
  }

  /* SET */
  set(token: string, key?: string) {
    localStorage.setItem(key || this.key, token);
  }

  /* REMOVE */
  remove(key?: string) {
    const debug = localStorage.getItem(key || this.key);
    alert('remove token from storage: '+debug);
    localStorage.removeItem(key || this.key);
    const debug2 = localStorage.getItem(key || this.key);
    alert('removed token ?? : '+debug2);
  }
}

export const tokenStorage = new TokenStorage();
