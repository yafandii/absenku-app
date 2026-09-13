import axios from "axios";
import { ApiError, getApiErrorMessage } from "./api-error";
import { tokenStorage } from "./token-storage";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL!,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response?.status || 500;
    const message = getApiErrorMessage(error);

    if (statusCode === 401 && typeof window !== "undefined") {
      tokenStorage.clearAuth();

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login?session=expired";
      }
    }

    return Promise.reject(new ApiError(message, statusCode, error));
  },
);
