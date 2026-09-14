import React from "react";
import {
  ClockIcon,
  ShieldCheckIcon,
  CheckIcon,
  CameraIcon,
} from "@/presentation/components/common/icons";
import { DashboardCamera } from "@/presentation/hooks/useDashboard";
import { Attendance } from "@/domain/entities/attendance.entity";
import { CameraViewfinder } from "./CameraViewfinder";
import { CameraPermissionModal } from "./CameraPermissionModal";

interface ClockInCardProps {
  isSubmitting: boolean;
  clockInSuccess: boolean;
  attendanceRecord?: Attendance | null;
  camera: DashboardCamera;
  onClockIn: () => void;
  onRetake: () => void;
}

export const ClockInCard: React.FC<ClockInCardProps> = ({
  isSubmitting,
  clockInSuccess,
  attendanceRecord,
  camera,
  onClockIn,
  onRetake,
}) => {
  const {
    videoRef,
    photoPreview,
    isCameraStreaming,
    cameraError,
    isPermissionBlocked,
    isGuideModalOpen,
    isCopied,
    settingsUrl,
    startCamera,
    captureSnapshot,
    openSettings,
    closeGuideModal,
    copySettingsUrl,
  } = camera;

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Presensi Mandiri
            </p>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Presensi Masuk Hari Ini
            </h2>
          </div>

          {photoPreview ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Foto Siap</span>
            </span>
          ) : isCameraStreaming ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Kamera Aktif</span>
            </span>
          ) : isPermissionBlocked ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Izin Diblokir</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Menghubungkan Kamera</span>
            </span>
          )}
        </div>

        <div className="rounded-2xl bg-indigo-50/50 border border-indigo-100/70 p-3 sm:p-3.5 space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 flex-shrink-0 mt-0.5 sm:mt-0">
              <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-base font-bold text-slate-900">
                  Jam Kerja Reguler
                </span>
                <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-100/90 text-indigo-700 whitespace-nowrap">
                  08:00 - 17:00 WIB
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 leading-snug">
                Pastikan wajah terlihat jelas dan berada di area presensi
              </p>
            </div>
          </div>

          <div className="border-t sm:border-t-0 pt-2 sm:pt-0 border-indigo-100/80 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center flex-shrink-0">
            <span className="text-[11px] text-slate-500 sm:text-slate-400 font-medium sm:text-[10px] sm:uppercase sm:tracking-wider">
              Batas Toleransi
            </span>
            <span className="text-xs font-bold text-indigo-950 sm:text-slate-800 bg-indigo-100/80 sm:bg-transparent px-2 sm:px-0 py-0.5 sm:py-0 rounded-md">
              s/d 08:30 WIB
            </span>
          </div>
        </div>

        <CameraViewfinder
          videoRef={videoRef}
          photoPreview={photoPreview}
          isCameraStreaming={isCameraStreaming}
          isPermissionBlocked={isPermissionBlocked}
          cameraError={cameraError}
          clockInSuccess={clockInSuccess}
          serverTimestamp={
            attendanceRecord
              ? `${attendanceRecord.date} • ${attendanceRecord.time}`
              : null
          }
          onRetake={onRetake}
        />

        {clockInSuccess ? (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold">
                Presensi berhasil dicatat pada{" "}
                {attendanceRecord?.time || "hari ini"}. Selamat bekerja!
              </span>
            </div>
            <button
              type="button"
              onClick={onRetake}
              className="text-emerald-700 font-bold hover:underline flex-shrink-0 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        ) : photoPreview ? (
          <button
            type="button"
            onClick={onClockIn}
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all duration-150 shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Memproses Verifikasi Wajah...</span>
              </>
            ) : (
              <>
                <CameraIcon className="w-5 h-5" />
                <span>Absen Masuk Sekarang</span>
              </>
            )}
          </button>
        ) : isCameraStreaming ? (
          <button
            type="button"
            onClick={captureSnapshot}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all duration-150 shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <CameraIcon className="w-5 h-5" />
            <span>Ambil Foto Wajah Sekarang</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={isPermissionBlocked ? openSettings : startCamera}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-white active:scale-[0.99] transition-all duration-150 shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer ${
              isPermissionBlocked
                ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25"
                : "bg-slate-700 hover:bg-slate-800"
            }`}
          >
            <CameraIcon className="w-5 h-5" />
            <span>
              {isPermissionBlocked
                ? "Buka Pengaturan Izin Kamera"
                : "Hubungkan Kamera Terlebih Dahulu"}
            </span>
          </button>
        )}

        <p className="text-center text-[10px] sm:text-[11px] text-slate-400 font-medium leading-relaxed">
          <ShieldCheckIcon className="w-3.5 h-3.5 text-slate-400 inline-block mr-1.5 align-[-2px] flex-shrink-0" />
          <span className="sm:whitespace-nowrap">
            Data presensi diverifikasi dan dienkripsi secara aman sesuai protokol perusahaan.
          </span>
        </p>
      </div>

      <CameraPermissionModal
        isOpen={isGuideModalOpen}
        onClose={closeGuideModal}
        settingsUrl={settingsUrl}
        isCopied={isCopied}
        onCopy={copySettingsUrl}
        onConfirm={() => {
          closeGuideModal();
          startCamera();
        }}
      />
    </>
  );
};
