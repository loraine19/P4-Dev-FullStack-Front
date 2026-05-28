import { describe, it, expect, beforeEach } from 'vitest';
import { tokenStorage } from './tokenStorage';

const DEFAULT_KEY = 'access_token';

beforeEach(() => {
  localStorage.clear();
});

describe('tokenStorage', () => {

  /* TK.1 get() */
  describe('TK.1 get()', () => {
    it('5.1.1 returns null when key is not set', () => {
      /* Act & Assert */
      expect(tokenStorage.get()).toBeNull();
    });

    it('5.1.2 returns stored token by default key', () => {
      /* Arrange */
      localStorage.setItem(DEFAULT_KEY, 'my-token');

      /* Act & Assert */
      expect(tokenStorage.get()).toBe('my-token');
    });

    it('5.1.3 returns stored token by custom key', () => {
      /* Arrange */
      localStorage.setItem('custom_key', 'custom-token');

      /* Act & Assert */
      expect(tokenStorage.get('custom_key')).toBe('custom-token');
    });
  });

  /* TK.2 set() */
  describe('TK.2 set()', () => {
    it('5.2.1 stores token under default key', () => {
      /* Act */
      tokenStorage.set('new-token');

      /* Assert */
      expect(localStorage.getItem(DEFAULT_KEY)).toBe('new-token');
    });

    it('5.2.2 stores token under custom key', () => {
      /* Act */
      tokenStorage.set('value', 'my_key');

      /* Assert */
      expect(localStorage.getItem('my_key')).toBe('value');
    });
  });

  /* TK.3 remove() */
  describe('TK.3 remove()', () => {
    it('5.3.1 removes token from default key', () => {
      /* Arrange */
      localStorage.setItem(DEFAULT_KEY, 'to-remove');

      /* Act */
      tokenStorage.remove();

      /* Assert */
      expect(localStorage.getItem(DEFAULT_KEY)).toBeNull();
    });

    it('5.3.2 removes token from custom key', () => {
      /* Arrange */
      localStorage.setItem('other_key', 'to-remove');

      /* Act */
      tokenStorage.remove('other_key');

      /* Assert */
      expect(localStorage.getItem('other_key')).toBeNull();
    });
  });
});
