const STORAGE_KEYS = {
  CART: "gttCart",
  TOKEN: "token",
  EXPIRY_DATE: "fecha_exp",
  VERSION: "version",
  USER: "usuarioObjeto"
} as const;

class StorageService {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return null;
    }
  }

  setItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, error);
      return false;
    }
  }

  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
      return false;
    }
  }

  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage", error);
      return false;
    }
  }

  getJson<T = unknown>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = this.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
      console.error(`Error parsing JSON from localStorage: ${key}`, error);
      return defaultValue;
    }
  }

  setJson(key: string, value: unknown): boolean {
    try {
      this.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error stringifying JSON for localStorage: ${key}`, error);
      return false;
    }
  }

  getToken(): string | null {
    return this.getItem(STORAGE_KEYS.TOKEN);
  }

  setToken(token: string): boolean {
    return this.setItem(STORAGE_KEYS.TOKEN, token);
  }

  getCart<T = unknown>(): T[] {
    return this.getJson<T[]>(STORAGE_KEYS.CART, []) as T[];
  }

  setCart(cart: unknown): boolean {
    return this.setJson(STORAGE_KEYS.CART, cart);
  }

  getExpiryDate(): string | null {
    return this.getItem(STORAGE_KEYS.EXPIRY_DATE);
  }

  setExpiryDate(date: string): boolean {
    return this.setItem(STORAGE_KEYS.EXPIRY_DATE, date);
  }

  getVersion<T = unknown>(): T | null {
    return this.getJson<T>(STORAGE_KEYS.VERSION);
  }

  setVersion(version: unknown): boolean {
    return this.setJson(STORAGE_KEYS.VERSION, version);
  }

  getUser(): unknown {
    return this.getJson(STORAGE_KEYS.USER, null);
  }

  setUser(user: unknown): boolean {
    return this.setJson(STORAGE_KEYS.USER, user);
  }

  removeUser(): boolean {
    return this.removeItem(STORAGE_KEYS.USER);
  }
}

export const storageService = new StorageService();
export { STORAGE_KEYS };
