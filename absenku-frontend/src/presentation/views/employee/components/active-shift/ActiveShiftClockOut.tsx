import React from "react";
import {
  LogoutIcon,
  CameraIcon,
  SpinnerIcon,
} from "@/presentation/components/common/icons";
import { CameraViewfinder } from "../CameraViewfinder";

interface ActiveShiftClockOutProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  photoPreview: string | null;
  isCameraStreaming: boolean;
  isPermissionBlocked: boolean;
  cameraError: string | null;
  onRetake: () => void;
  onStartCamera: () => void;
  onCapture: () => void;
  onConfirmSave: () => void;
  isSubmitting?: boolean;
  error?: string | null;
}

export const ActiveShiftClockOut: React.FC<ActiveShiftClockOutProps> = ({
  isOpen,
  onOpen,
  onClose,
  videoRef,
  photoPreview,
  isCameraStreaming,
  isPermissionBlocked,
  cameraError,
  onRetake,
  onStartCamera,
  onCapture,
  onConfirmSave,
  isSubmitting = false,
  error = null,
}) => {
  return (
    <div className="pt-2 border-t border-slate-100 space-y-4">
      {!isOpen ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-sm">
              ✨
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-amber-950">
                Udah Siap Selesai Kerja?
              </h3>
              <p className="text-[11px] sm:text-xs text-amber-800/90 font-medium mt-0.5 leading-relaxed">
                Kalau tugas hari ini udah beres, yuk tandai selesai biar durasi
                kerjamu tercatat rapi!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpen}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700 hover:from-amber-700 hover:via-rose-700 hover:to-rose-800 active:scale-[0.99] transition-all duration-150 shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <LogoutIcon className="w-4 h-4 text-white rotate-180" />
            <span>Selesai Kerja Hari Ini ✨</span>
          </button>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <span className="font-semibold">{error}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/20 p-4 sm:p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-rose-600 uppercase bg-rose-100/80 px-2 py-0.5 rounded-md">
                Selesai Kerja
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                Ambil Selfie Selesai Kerja
              </h3>
            </div>

            {photoPreview ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Foto Siap</span>
              </span>
            ) : isCameraStreaming ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                <span>Kamera Aktif</span>
              </span>
            ) : null}
          </div>

          <CameraViewfinder
            videoRef={videoRef}
            photoPreview={photoPreview}
            isCameraStreaming={isCameraStreaming}
            isPermissionBlocked={isPermissionBlocked}
            cameraError={cameraError}
            onRetake={onRetake}
          />

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            {photoPreview ? (
              <button
                type="button"
                onClick={onConfirmSave}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700 hover:from-amber-700 hover:via-rose-700 hover:to-rose-800 active:scale-[0.99] transition-all shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <SpinnerIcon className="animate-spin h-4 w-4 text-white" />
                    <span>Menyimpan presensi selesaimu...</span>
                  </>
                ) : (
                  <>
                    <LogoutIcon className="w-4 h-4 text-white rotate-180" />
                    <span>Konfirmasi Selesai Kerja 👍</span>
                  </>
                )}
              </button>
            ) : isCameraStreaming ? (
              <button
                type="button"
                onClick={onCapture}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.99] transition-all shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <CameraIcon className="w-5 h-5" />
                <span>Ambil Foto Selesai 📸</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onStartCamera}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-slate-700 hover:bg-slate-800 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <CameraIcon className="w-5 h-5" />
                <span>Nyalakan Kamera Dulu</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Nanti Dulu, Masih Kerja
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
