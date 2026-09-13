import React from "react";
import Link from "next/link";
import { LoginState, LoginActions } from "@/presentation/hooks/useLogin";
import { Input } from "@/presentation/components/common/Input";
import { Button } from "@/presentation/components/common/Button";
import { Alert } from "@/presentation/components/common/Alert";

interface LoginFormProps {
  state: LoginState;
  actions: LoginActions;
}

export const LoginForm: React.FC<LoginFormProps> = ({ state, actions }) => {
  const { nik, password, showPassword, rememberMe, isLoading, errorMessage } =
    state;

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
          required
          leftIcon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
              />
            </svg>
          }
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
            required
            leftIcon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            }
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
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            }
          />
        </div>

        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => actions.setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-white cursor-pointer"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 text-xs text-slate-600 cursor-pointer"
          >
            Ingat NIK saya di perangkat ini
          </label>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Memvalidasi NIK..."
          className="mt-2"
        >
          <span>Masuk ke Absenku</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Button>
      </form>
    </div>
  );
};
