import axios from "axios";
import { ApiError, getApiErrorMessage } from "./api-error";
import { authStorage } from "./auth-storage";
import Cookies from "js-cookie";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL!,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response?.status || 500;
    const message = getApiErrorMessage(error);

    if (statusCode === 401 && typeof window !== "undefined") {
      authStorage.clearAuth();
      Cookies.remove(process.env.NEXT_PUBLIC_ID_COOKIE_TOKEN!);

      if (!window.location.pathname.includes("/login")) {
        window.location.replace("/login?session=expired");
      }
    }

    return Promise.reject(new ApiError(message, statusCode, error));
  },
);

export const getServerApiClient = async () => {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const cookieName = process.env.NEXT_PUBLIC_ID_COOKIE_TOKEN || "_AT_";

  const token =
    cookieStore.get(cookieName)?.value ||
    cookieStore.get("_AT_")?.value ||
    cookieStore.get("_T_")?.value;

  if (!token) {
    console.warn(
      `[getServerApiClient] Cookie '${cookieName}' tidak ditemukan di request header!`,
    );
  }

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000",
    withCredentials: true,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Cookie: `${cookieName}=${token}`,
    },
  });

  return instance;
};
