import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/infrastructure/http/api-client";
import { API_ENDPOINTS } from "@/infrastructure/http/endpoints";
import { getApiErrorMessage } from "@/infrastructure/http/api-error";
import { tokenStorage } from "@/infrastructure/http/token-storage";

export interface LoginState {
  nik: string;
  password: string;
  showPassword: boolean;
  rememberMe: boolean;
  isLoading: boolean;
  errorMessage: string | null;
}

export interface LoginActions {
  setNik: (value: string) => void;
  setPassword: (value: string) => void;
  toggleShowPassword: () => void;
  setRememberMe: (value: boolean) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  clearError: () => void;
}

export function useLogin(): { state: LoginState; actions: LoginActions } {
  const router = useRouter();

  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedNik = tokenStorage.getRememberedNik();
    if (savedNik) {
      setNik(savedNik);
      setRememberMe(true);
    }
  }, []);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const clearError = () => {
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedNik = nik.trim();
    if (!trimmedNik) {
      setErrorMessage("Silakan masukkan Nomor Induk Karyawan (NIK) Anda.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Silakan masukkan kata sandi (password) Anda.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        id: trimmedNik,
        password: password,
      });

      const data = response.data;
      const token = data?.access_token || data?.token;
      const user = data?.user || data?.data;

      if (token) {
        tokenStorage.setToken(token);
      }

      if (user) {
        tokenStorage.setUser(user);
      }

      if (rememberMe) {
        tokenStorage.setRememberedNik(trimmedNik);
      } else {
        tokenStorage.removeRememberedNik();
      }

      alert("login berhasil");
      // router.push("/dashboard");
    } catch (err: unknown) {
      setErrorMessage(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    state: {
      nik,
      password,
      showPassword,
      rememberMe,
      isLoading,
      errorMessage,
    },
    actions: {
      setNik: (val) => {
        setNik(val);
        if (errorMessage) setErrorMessage(null);
      },
      setPassword: (val) => {
        setPassword(val);
        if (errorMessage) setErrorMessage(null);
      },
      toggleShowPassword,
      setRememberMe,
      handleSubmit,
      clearError,
    },
  };
}
