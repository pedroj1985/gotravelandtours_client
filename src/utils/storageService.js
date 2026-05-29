/**
 * Centralized localStorage service for GoTravelAndTours
 * Provides safe access to localStorage with error handling and type safety
 */

const STORAGE_KEYS = {
  CART: "gttCart",
  TOKEN: "token",
  EXPIRY_DATE: "fecha_exp",
  VERSION: "version"
};

class StorageService {
  /**
   * Get an item from localStorage
   * @param {string} key - The storage key
   * @returns {string|null} The stored value or null if not found
   */
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return null;
    }
  }

  /**
   * Set an item in localStorage
   * @param {string} key - The storage key
   * @param {string} value - The value to store
   * @returns {boolean} True if successful, false otherwise
   */
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, error);
      return false;
    }
  }

  /**
   * Remove an item from localStorage
   * @param {string} key - The storage key
   * @returns {boolean} True if successful, false otherwise
   */
  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
      return false;
    }
  }

  /**
   * Clear all localStorage
   * @returns {boolean} True if successful, false otherwise
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage", error);
      return false;
    }
  }

  /**
   * Get parsed JSON from localStorage
   * @param {string} key - The storage key
   * @param {*} defaultValue - Default value if parsing fails or key not found
   * @returns {*} The parsed value or default value
   */
  getJson(key, defaultValue = null) {
    try {
      const item = this.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error parsing JSON from localStorage: ${key}`, error);
      return defaultValue;
    }
  }

  /**
   * Set JSON object in localStorage
   * @param {string} key - The storage key
   * @param {*} value - The value to stringify and store
   * @returns {boolean} True if successful, false otherwise
   */
  setJson(key, value) {
    try {
      this.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error stringifying JSON for localStorage: ${key}`, error);
      return false;
    }
  }

  // Specific methods for common operations

  /**
   * Encode token with simple obfuscation (Base64 reverse)
   * Not cryptographic security, but prevents casual exposure
   */
  _encodeToken(token) {
    try {
      return btoa(token)
        .split("")
        .reverse()
        .join("");
    } catch {
      return token;
    }
  }

  /**
   * Decode obfuscated token
   */
  _decodeToken(encoded) {
    try {
      return atob(
        encoded
          .split("")
          .reverse()
          .join("")
      );
    } catch {
      return encoded;
    }
  }

  /**
   * Get authentication token (decoded)
   * @returns {string|null} The token or null
   */
  getToken() {
    const encoded = this.getItem(STORAGE_KEYS.TOKEN);
    return encoded ? this._decodeToken(encoded) : null;
  }

  /**
   * Set authentication token (encoded)
   * @param {string} token - The token to store
   * @returns {boolean} True if successful
   */
  setToken(token) {
    return this.setItem(STORAGE_KEYS.TOKEN, this._encodeToken(token));
  }

  /**
   * Remove authentication token
   * @returns {boolean} True if successful
   */
  clearToken() {
    return this.removeItem(STORAGE_KEYS.TOKEN);
  }

  /**
   * Get cart data
   * @returns {Array} The cart items array
   */
  getCart() {
    return this.getJson(STORAGE_KEYS.CART, []);
  }

  /**
   * Set cart data
   * @param {Array} cart - The cart items array
   * @returns {boolean} True if successful
   */
  setCart(cart) {
    return this.setJson(STORAGE_KEYS.CART, cart);
  }

  /**
   * Get expiry date
   * @returns {string|null} The expiry date string
   */
  getExpiryDate() {
    return this.getItem(STORAGE_KEYS.EXPIRY_DATE);
  }

  /**
   * Set expiry date
   * @param {string} date - The expiry date string
   * @returns {boolean} True if successful
   */
  setExpiryDate(date) {
    return this.setItem(STORAGE_KEYS.EXPIRY_DATE, date);
  }

  /**
   * Get version data
   * @returns {*} The version data
   */
  getVersion() {
    return this.getJson(STORAGE_KEYS.VERSION);
  }

  /**
   * Set version data
   * @param {*} version - The version data
   * @returns {boolean} True if successful
   */
  setVersion(version) {
    return this.setJson(STORAGE_KEYS.VERSION, version);
  }
}

export const storageService = new StorageService();
export { STORAGE_KEYS };
