import React from "react";
import {
  CloseIcon,
  ClockIcon,
  GpsIcon,
  DownloadIcon,
  CheckIcon,
} from "@/presentation/components/common/icons";
import { MonitorAttendanceItem } from "../types";

interface AttendanceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MonitorAttendanceItem | null;
  onDownloadSingle: (item: MonitorAttendanceItem) => void;
}

export const AttendanceDetailModal: React.FC<AttendanceDetailModalProps> = ({
  isOpen,
  onClose,
  item,
  onDownloadSingle,
}) => {
  if (!isOpen || !item) return null;

  const isOnTime = item.status === "on_time";

  const getFullPhotoUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
    return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const inPhoto = getFullPhotoUrl(item.photoUrl);
  const outPhoto = getFullPhotoUrl(item.clockOutPhotoUrl);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-5 sm:p-6 space-y-5 animate-in zoom-in-95 duration-150 my-8">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Detail Presensi Karyawan
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-xs font-bold border border-indigo-200/60">
                {item.userNik || item.userId}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {item.userName} &bull; {item.divisionName || "Tanpa Divisi"} &bull; Tanggal: {item.date}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 rounded-xl p-3 border border-slate-100">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Status Masuk
            </span>
            <span
              className={`inline-flex items-center gap-1 mt-1 text-xs font-bold ${
                isOnTime ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {isOnTime ? <CheckIcon className="w-3.5 h-3.5" /> : <ClockIcon className="w-3.5 h-3.5" />}
              {isOnTime ? "Tepat Waktu" : "Terlambat"}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Jam Masuk
            </span>
            <span className="text-xs font-mono font-bold text-slate-800 block mt-1">
              {item.timeIn || "-"}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Jam Pulang
            </span>
            <span className="text-xs font-mono font-bold text-slate-800 block mt-1">
              {item.timeOut || "Belum Absen"}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Durasi Kerja
            </span>
            <span className="text-xs font-bold text-indigo-600 block mt-1">
              {item.workDurationLabel || "-"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200/80 p-3.5 space-y-2.5 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Bukti Presensi Masuk
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {item.timeIn}
              </span>
            </div>

            <div className="w-full aspect-4/3 rounded-lg bg-slate-100 overflow-hidden border border-slate-100 flex items-center justify-center">
              {inPhoto ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={inPhoto}
                  alt={`Bukti Masuk ${item.userName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-slate-400 font-medium">
                  Tidak ada foto
                </span>
              )}
            </div>

            {item.latitude && item.longitude && (
              <a
                href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:underline pt-1"
              >
                <GpsIcon className="w-3.5 h-3.5" />
                <span>
                  {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)} (Buka Maps)
                </span>
              </a>
            )}
          </div>

          <div className="rounded-xl border border-slate-200/80 p-3.5 space-y-2.5 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Bukti Presensi Pulang
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {item.timeOut || "-"}
              </span>
            </div>

            <div className="w-full aspect-4/3 rounded-lg bg-slate-100 overflow-hidden border border-slate-100 flex items-center justify-center">
              {outPhoto ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={outPhoto}
                  alt={`Bukti Pulang ${item.userName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-slate-400 font-medium">
                  {item.timeOut ? "Tidak ada foto" : "Belum absen pulang"}
                </span>
              )}
            </div>

            {item.clockOutLatitude && item.clockOutLongitude && (
              <a
                href={`https://www.google.com/maps?q=${item.clockOutLatitude},${item.clockOutLongitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:underline pt-1"
              >
                <GpsIcon className="w-3.5 h-3.5" />
                <span>
                  {item.clockOutLatitude.toFixed(5)}, {item.clockOutLongitude.toFixed(5)} (Buka Maps)
                </span>
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => onDownloadSingle(item)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>Download Rekap Karyawan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
