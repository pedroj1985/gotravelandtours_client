import { storageService } from "./storageService";
import { hotetecStateSession, hotetecOpenSession } from "@/utils/auth";
import { withRetry } from "./errorHandler";
import { logger } from "./logger";

const HOTELEC_SESSION_KEY = "currentHotelecIds";

class HotelecSessionService {
  getSessionId(): string | null {
    return storageService.getItem(HOTELEC_SESSION_KEY);
  }

  setSessionId(sessionId: string): boolean {
    return storageService.setItem(HOTELEC_SESSION_KEY, sessionId);
  }

  clearSessionId(): boolean {
    return storageService.removeItem(HOTELEC_SESSION_KEY);
  }

  async isSessionValid(): Promise<boolean> {
    const currentSession = this.getSessionId();
    if (!currentSession) {
      return false;
    }

    try {
      const response = await hotetecStateSession(currentSession);
      return response.data && response.data.Infses === true;
    } catch (error) {
      logger.error("Error validating Hotelec session:", error);
      return false;
    }
  }

  async openNewSession(): Promise<string | null> {
    return withRetry(async () => {
      const response = await hotetecOpenSession();
      if (response && response.data && response.data.Ideses) {
        const sessionId = response.data.Ideses as string;
        this.setSessionId(sessionId);
        return sessionId;
      }
      return null;
    }, 2, "hotetecOpenSession");
  }

  async getOrCreateSession(): Promise<string | null> {
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

  async refreshSessionIfNeeded(): Promise<string | null> {
    return this.getOrCreateSession();
  }

  logout(): boolean {
    return this.clearSessionId();
  }
}

export const hotelecSessionService = new HotelecSessionService();
