const USER_KEY = "user";
const REMEMBERED_NIK_KEY = "remembered_nik";

const isClient = typeof window !== "undefined";

export const authStorage = {
  getUser: <T = unknown>(): T | null => {
    if (!isClient) return null;
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  setUser: <T = unknown>(user: T): void => {
    if (!isClient) return;
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {}
  },

  removeUser: (): void => {
    if (!isClient) return;
    try {
      localStorage.removeItem(USER_KEY);
    } catch {}
  },

  clearAuth: (): void => {
    if (!isClient) return;
    try {
      localStorage.removeItem(USER_KEY);
    } catch {}
  },

  getRememberedNik: (): string | null => {
    if (!isClient) return null;
    try {
      return localStorage.getItem(REMEMBERED_NIK_KEY);
    } catch {
      return null;
    }
  },

  setRememberedNik: (nik: string): void => {
    if (!isClient) return;
    try {
      localStorage.setItem(REMEMBERED_NIK_KEY, nik);
    } catch {}
  },

  removeRememberedNik: (): void => {
    if (!isClient) return;
    try {
      localStorage.removeItem(REMEMBERED_NIK_KEY);
    } catch {}
  },
};
