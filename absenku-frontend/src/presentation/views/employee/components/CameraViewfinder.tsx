import React from "react";
import {
  CheckIcon,
  RefreshIcon,
  CameraIcon,
} from "@/presentation/components/common/icons";

interface CameraViewfinderProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  photoPreview: string | null;
  isCameraStreaming: boolean;
  isPermissionBlocked: boolean;
  cameraError: string | null;
  serverTimestamp?: string | null;
  clockInSuccess?: boolean;
  onRetake: () => void;
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  videoRef,
  photoPreview,
  isCameraStreaming,
  isPermissionBlocked,
  cameraError,
  serverTimestamp,
  clockInSuccess,
  onRetake,
}) => {
  return (
    <div className="relative rounded-2xl overflow-hidden aspect-[16/9] max-h-[340px] bg-slate-950 border border-slate-200/80 group select-none flex items-center justify-center">
      {photoPreview ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoPreview}
            alt="Foto Presensi Karyawan"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 z-20">
            {clockInSuccess && serverTimestamp ? (
              <div className="inline-flex items-center gap-1.5 text-white/95 text-[10px] sm:text-[11px] font-medium bg-slate-900/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-emerald-500/40 shadow-sm whitespace-nowrap">
                <CheckIcon className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-emerald-400 font-semibold">Terverifikasi:</span>
                <span>{serverTimestamp}</span>
              </div>
            ) : (
              <div />
            )}

            {!clockInSuccess && (
              <button
                type="button"
                onClick={onRetake}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold backdrop-blur-md transition-all shadow-sm cursor-pointer whitespace-nowrap flex-shrink-0"
              >
                <RefreshIcon className="w-3.5 h-3.5" />
                <span>Ambil Ulang</span>
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover object-center transform -scale-x-100 ${
              isCameraStreaming ? "block" : "hidden"
            }`}
          />

          {isCameraStreaming && (
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />
          )}

          {!isCameraStreaming && (
            <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center text-white space-y-2.5">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                  isPermissionBlocked
                    ? "bg-rose-500/20 border border-rose-500/40 text-rose-400"
                    : "bg-indigo-600/30 border border-indigo-400/40 text-indigo-400"
                }`}
              >
                <CameraIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <div>
                <p className="text-sm sm:text-base font-bold text-white tracking-wide">
                  {isPermissionBlocked
                    ? "Izin Akses Kamera Diblokir"
                    : cameraError || "Menghubungkan Kamera Depan..."}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 max-w-sm leading-relaxed">
                  {isPermissionBlocked
                    ? "Izin kamera diblokir. Klik tombol di bawah untuk menyalin URL pengaturan dan mengaktifkan izin di tab baru."
                    : "Pastikan kamera perangkat Anda terhubung dan aktif untuk melakukan presensi wajah."}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
