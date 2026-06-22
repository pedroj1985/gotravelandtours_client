import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from "axios";
import { logger } from "../utils/logger";
import { notifyError, getErrorMessage, isNetworkError, isTimeoutError } from "../utils/errorHandler";

const HTTP: AxiosInstance = axios.create({
  baseURL: import.meta.env.API_URL || "http://localhost:5000/api/",
  timeout: 120000,
  headers: { "Content-Type": "application/json" }
});

HTTP.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    logger.debug(`[${config.method?.toUpperCase()}] ${config.url}`);
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

HTTP.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (isNetworkError(error as unknown as Record<string, unknown>)) {
      notifyError("Error de conexión. Verifique su internet.");
    } else if (isTimeoutError(error as unknown as Record<string, unknown>)) {
      notifyError("La solicitud tardó demasiado. Intente de nuevo.");
    } else {
      const status = error.response?.status;
      if (status === 401) {
        notifyError("Sesión expirada. Inicie sesión nuevamente.");
      } else if (status === 403) {
        notifyError("No tiene permisos para esta acción.");
      } else if (status !== undefined && status >= 500) {
        logger.error(`Server error [${status}]:`, error.response?.data);
        notifyError("Error del servidor. Intente más tarde.");
      } else {
        notifyError(getErrorMessage(error as unknown as Record<string, unknown>));
      }
    }
    return Promise.reject(error);
  }
);

export { HTTP };
export default HTTP;
