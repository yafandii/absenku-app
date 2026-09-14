import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginUseCase } from "@/domain/use-cases/auth/login.use-case";
import { AuthRepositoryImpl } from "@/data/repositories/auth.repository.impl";
import { getApiErrorMessage } from "@/infrastructure/http/api-error";

export interface LoginState {
  nik: string;
  password: string;
  showPassword: boolean;
  isLoading: boolean;
  errorMessage: string | null;
}

export interface LoginActions {
  setNik: (value: string) => void;
  setPassword: (value: string) => void;
  toggleShowPassword: () => void;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>;
  clearError: () => void;
}

const defaultLoginUseCase = new LoginUseCase(new AuthRepositoryImpl());

export function useLogin(loginUseCase: LoginUseCase = defaultLoginUseCase): {
  state: LoginState;
  actions: LoginActions;
} {
  const router = useRouter();

  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const clearError = () => {
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
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
      await loginUseCase.execute({
        id: trimmedNik,
        password: password,
      });

      router.push("/dashboard");
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
      handleSubmit,
      clearError,
    },
  };
}
