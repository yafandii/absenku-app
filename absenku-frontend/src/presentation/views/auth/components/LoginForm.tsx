import React from "react";
import Link from "next/link";
import { LoginState, LoginActions } from "@/presentation/hooks/useLogin";
import { Input } from "@/presentation/components/common/Input";
import { Button } from "@/presentation/components/common/Button";
import { Alert } from "@/presentation/components/common/Alert";
import {
  IdCardIcon,
  LockIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
} from "@/presentation/components/common/icons";

interface LoginFormProps {
  state: LoginState;
  actions: LoginActions;
}

export const LoginForm: React.FC<LoginFormProps> = ({ state, actions }) => {
  const { nik, password, showPassword, isLoading, errorMessage } = state;

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900">
          Masuk ke Akun Anda
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Gunakan NIK karyawan Anda untuk melanjutkan.
        </p>
      </div>

      {errorMessage && (
        <Alert
          message={errorMessage}
          type="error"
          className="mb-5"
          onClose={actions.clearError}
        />
      )}

      <form onSubmit={actions.handleSubmit} className="space-y-4">
        <Input
          id="nik"
          name="nik"
          type="text"
          label="Nomor Induk Karyawan (NIK)"
          value={nik}
          onChange={(e) => actions.setNik(e.target.value)}
          placeholder="Masukkan NIK (contoh: 202603001)"
          autoComplete="username"
          required
          leftIcon={<IdCardIcon className="w-4 h-4" />}
        />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-slate-700"
            >
              Password
            </label>
            <Link
              href="#"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Lupa password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => actions.setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            leftIcon={<LockIcon className="w-4 h-4" />}
            rightAction={
              <button
                type="button"
                onClick={actions.toggleShowPassword}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label={
                  showPassword ? "Sembunyikan password" : "Lihat password"
                }
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </button>
            }
          />
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Memvalidasi NIK..."
          className="mt-8"
        >
          <span>Masuk ke Absenku</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
