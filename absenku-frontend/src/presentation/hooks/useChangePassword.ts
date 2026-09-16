import { useState, useMemo, FormEvent } from "react";
import { UserRepositoryImpl } from "@/data/repositories/user.repository.impl";
import { ChangePasswordUseCase } from "@/domain/use-cases/user/change-password.use-case";
import { getApiErrorMessage } from "@/infrastructure/http/api-error";

interface UseChangePasswordProps {
  onSuccessClose?: () => void;
}

export function useChangePassword({ onSuccessClose }: UseChangePasswordProps = {}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userRepository = useMemo(() => new UserRepositoryImpl(), []);
  const changePasswordUseCase = useMemo(
    () => new ChangePasswordUseCase(userRepository),
    [userRepository],
  );

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(false);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword) {
      setError("Password saat ini wajib diisi.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password baru minimal 6 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password baru tidak cocok.");
      return;
    }

    setIsSubmitting(true);
    try {
      await changePasswordUseCase.execute({
        currentPassword,
        newPassword,
      });

      setSuccess(true);
      setTimeout(() => {
        resetForm();
        onSuccessClose?.();
      }, 1500);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    success,
    isSubmitting,
    handleSubmit,
    resetForm,
  };
}
