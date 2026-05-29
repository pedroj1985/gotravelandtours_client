/**
 * Hotelec Session Management Service
 * Centralizes all Hotelec session handling logic
 */

import { storageService } from "./storageService";
import { hotetecStateSession, hotetecOpenSession } from "@/utils/auth";

const HOTELEC_SESSION_KEY = "currentHotelecIds";

class HotelecSessionService {
  /**
   * Get the current Hotelec session ID
   * @returns {string|null} The session ID or null if not found
   */
  getSessionId() {
    return storageService.getItem(HOTELEC_SESSION_KEY);
  }

  /**
   * Set the Hotelec session ID
   * @param {string} sessionId - The session ID to store
   * @returns {boolean} True if successful
   */
  setSessionId(sessionId) {
    return storageService.setItem(HOTELEC_SESSION_KEY, sessionId);
  }

  /**
   * Clear the Hotelec session ID
   * @returns {boolean} True if successful
   */
  clearSessionId() {
    return storageService.removeItem(HOTELEC_SESSION_KEY);
  }

  /**
   * Check if the current session is valid
   * @returns {Promise<boolean>} True if session is valid, false otherwise
   */
  async isSessionValid() {
    const currentSession = this.getSessionId();
    if (!currentSession) {
      return false;
    }

    try {
      const response = await hotetecStateSession(currentSession);
      return response.data && response.data.Infses === true;
    } catch (error) {
      console.error("Error validating Hotelec session:", error);
      return false;
    }
  }

  /**
   * Open a new Hotelec session
   * @returns {Promise<string|null>} The new session ID or null if failed
   */
  async openNewSession() {
    try {
      const response = await hotetecOpenSession();
      if (response && response.data && response.data.Ideses) {
        const sessionId = response.data.Ideses;
        this.setSessionId(sessionId);
        return sessionId;
      }
      return null;
    } catch (error) {
      console.error("Error opening new Hotelec session:", error);
      return null;
    }
  }

  /**
   * Get a valid Hotelec session ID, opening a new one if necessary
   * Ensures the session is valid before returning
   * @returns {Promise<string|null>} A valid session ID or null if failed
   */
  async getOrCreateSession() {
    let currentSession = this.getSessionId();
    let isValid = false;

    if (currentSession) {
      isValid = await this.isSessionValid();
    }

    if (!currentSession || !isValid) {
      currentSession = await this.openNewSession();
    }

    return currentSession;
  }

  /**
   * Check session validity and refresh if needed
   * @returns {Promise<string|null>} A valid session ID or null if failed
   */
  async refreshSessionIfNeeded() {
    return this.getOrCreateSession();
  }

  /**
   * Clear the session when logging out or on error
   * @returns {boolean} True if successful
   */
  logout() {
    return this.clearSessionId();
  }
}

export const hotelecSessionService = new HotelecSessionService();
