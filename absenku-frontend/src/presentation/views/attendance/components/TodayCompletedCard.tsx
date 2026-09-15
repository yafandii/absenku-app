import React from "react";
import {
  ShieldCheckIcon,
  CheckIcon,
} from "@/presentation/components/common/icons";
import { AttendanceEntity } from "@/domain/entities/attendance.entity";
import { useTodayCompleted } from "@/presentation/hooks/useTodayCompleted";

interface TodayCompletedCardProps {
  attendanceRecord: AttendanceEntity;
}

export const TodayCompletedCard: React.FC<TodayCompletedCardProps> = ({
  attendanceRecord,
}) => {
  const {
    activePhotoModal,
    setActivePhotoModal,
    clockInPhotoSrc,
    clockOutPhotoSrc,
    clockOutTime,
    durationText,
    progressPercent,
    isTargetMet,
  } = useTodayCompleted(attendanceRecord);

  const isLate = attendanceRecord.status !== "on_time";
  const statusLabel =
    attendanceRecord.statusLabel || (isLate ? "Terlambat" : "Tepat Waktu");

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Presensi Mandiri
          </p>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
            Kerja Hari Ini Udah Beres!
          </h2>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="whitespace-nowrap">Hari Ini Komplit</span>
        </span>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-emerald-50/70 via-slate-50 to-indigo-50/40 border border-emerald-100/80 p-3.5 sm:p-5 space-y-3 sm:space-y-4">
        <div className="grid grid-cols-2 gap-3 pb-3 border-b border-emerald-100/70">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500">
                Jam Masuk
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                  isLate
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {statusLabel}
              </span>
            </div>
            <p className="text-base sm:text-lg font-black text-slate-900 font-mono">
              {attendanceRecord.timeIn}{" "}
              <span className="text-xs font-semibold text-slate-400">WIB</span>
            </p>
          </div>

          <div className="space-y-1 text-right min-w-0">
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500">
                Jam Selesai
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 whitespace-nowrap">
                Terverifikasi
              </span>
            </div>
            <p className="text-base sm:text-lg font-black text-slate-900 font-mono">
              {clockOutTime}{" "}
              <span className="text-xs font-semibold text-slate-400">WIB</span>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">
                Total Jam Kerja
              </span>
              <p className="text-base sm:text-lg font-black text-indigo-600 font-mono mt-0.5">
                {durationText}
              </p>
            </div>
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full w-fit whitespace-nowrap ${
                isTargetMet
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {isTargetMet
                ? "✓ Target 8 Jam Terpenuhi"
                : `${progressPercent}% dari Target 8 Jam`}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isTargetMet ? "bg-emerald-500" : "bg-indigo-600"
              }`}
              style={{
                width: `${progressPercent}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
          Dokumentasi Presensi Hari Ini
        </p>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <div
            onClick={() => setActivePhotoModal("in")}
            className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-950 border border-slate-200/80 cursor-pointer shadow-xs hover:border-indigo-300 transition-all"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={clockInPhotoSrc}
              alt="Foto Presensi Masuk"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[10px] sm:text-[11px]">
              <span className="font-bold flex items-center gap-1 truncate">
                <CheckIcon className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                Masuk
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-300 underline underline-offset-2 flex-shrink-0">
                Perbesar
              </span>
            </div>
          </div>

          <div
            onClick={() => clockOutPhotoSrc && setActivePhotoModal("out")}
            className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-950 border border-slate-200/80 cursor-pointer shadow-xs hover:border-indigo-300 transition-all"
          >
            {clockOutPhotoSrc ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={clockOutPhotoSrc}
                  alt="Foto Selesai Kerja"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[10px] sm:text-[11px]">
                  <span className="font-bold flex items-center gap-1 truncate">
                    <CheckIcon className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    Selesai
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-300 underline underline-offset-2 flex-shrink-0">
                    Perbesar
                  </span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                Foto Selesai Tidak Tersedia
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 flex items-start sm:items-center gap-3 text-xs">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-emerald-600/20 mt-0.5 sm:mt-0">
          <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-xs sm:text-sm text-emerald-950">
            Mantap, hari ini kelar dengan sukses!
          </p>
          <p className="text-[11px] text-emerald-700 font-medium mt-0.5 leading-relaxed">
            Sekarang waktunya istirahat dan isi ulang energimu! ✨
          </p>
        </div>
      </div>

      <p className="text-center text-[10px] sm:text-[11px] text-slate-400 font-medium leading-relaxed">
        <ShieldCheckIcon className="w-3.5 h-3.5 text-slate-400 inline-block mr-1.5 align-[-2px] flex-shrink-0" />
        <span className="sm:whitespace-nowrap">
          Data presensi tersimpan rapi dan aman di server Absenku.
        </span>
      </p>

      {activePhotoModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActivePhotoModal(null)}
        >
          <div
            className="relative max-w-lg w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl space-y-3 p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-white px-2 pt-1">
              <p className="text-sm font-bold">
                {activePhotoModal === "in"
                  ? `Foto Presensi Masuk (${attendanceRecord.timeIn} WIB)`
                  : `Foto Selesai Kerja (${clockOutTime} WIB)`}
              </p>
              <button
                type="button"
                onClick={() => setActivePhotoModal(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕ Tutup
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-video w-full bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  activePhotoModal === "in" ? clockInPhotoSrc : clockOutPhotoSrc
                }
                alt="Detail Foto Presensi"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
