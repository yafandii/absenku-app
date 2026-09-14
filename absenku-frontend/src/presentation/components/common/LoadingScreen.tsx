import React from "react";
import { BrandLogo } from "./BrandLogo";

interface LoadingScreenProps {
  message?: string;
  submessage?: string;
  fullScreen?: boolean;
  showLogo?: boolean;
  className?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Memuat halaman...",
  submessage = "Mohon tunggu sebentar",
  fullScreen = true,
  showLogo = true,
  className = "",
}) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100/80 ${
        fullScreen
          ? "fixed inset-0 z-50 h-screen w-screen"
          : "w-full min-h-[360px] py-12"
      } ${className}`}
    >
      {/* Ambient background glow effects */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Central Interactive Loader Card */}
      <div className="relative z-10 flex flex-col items-center px-6 py-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-xl shadow-indigo-500/5 max-w-xs sm:max-w-sm w-full mx-4 text-center transition-all duration-300">
        {/* Animated Brand Glow Container */}
        {showLogo && (
          <div className="relative mb-6">
            {/* Outer breathing ring */}
            <div className="absolute -inset-2.5 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-indigo-500/20 blur-md animate-pulse" />

            {/* Logo Badge */}
            <div className="relative px-4 py-2.5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-sm flex items-center justify-center">
              <BrandLogo size="md" />
            </div>
          </div>
        )}

        {/* Dynamic Dual-Ring Spinner with glowing pulse */}
        <div className="relative w-12 h-12 mb-5 flex items-center justify-center">
          {/* Track ring */}
          <div className="absolute inset-0 rounded-full border-2 border-indigo-100" />

          {/* Fast outer gradient spinner */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-600 border-r-indigo-500 animate-spin" />

          {/* Counter rotating inner subtle ring */}
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-violet-500 animate-[spin_1.5s_linear_infinite_reverse]" />

          {/* Glowing central core dot */}
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping opacity-75" />
        </div>

        {/* Informative Typography */}
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight flex items-center justify-center gap-0.5">
            <span>{message}</span>
          </h3>
          {submessage && (
            <p className="text-xs text-slate-400 font-medium">{submessage}</p>
          )}
        </div>

        <div className="w-28 h-1 bg-slate-100 rounded-full mt-4 overflow-hidden relative">
          <div className="h-full w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};
