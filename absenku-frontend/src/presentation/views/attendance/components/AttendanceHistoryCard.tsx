import React from "react";
import { AttendanceItem } from "@/presentation/hooks/useDashboard";
import {
  CalendarIcon,
  ClockIcon,
} from "@/presentation/components/common/icons";
import { EmptyState } from "@/presentation/components/common/EmptyState";
import { SummaryAttendanceEntity } from "@/domain/entities/attendance.entity";

interface AttendanceHistoryCardProps {
  attendances: AttendanceItem[];
  summary?: SummaryAttendanceEntity | null;
}

export const AttendanceHistoryCard: React.FC<AttendanceHistoryCardProps> = ({
  attendances = [],
  summary,
}) => {
  const hasAttendances = Array.isArray(attendances) && attendances.length > 0;
  console.log(summary);
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-5">
      <div>
        <div className="flex items-center justify-between mb-4 gap-2">
          <div>
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Catatan Presensi
            </p>
            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900">
              Riwayat Absensi
            </h2>
          </div>
          <span className="px-2 sm:px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] sm:text-xs font-semibold whitespace-nowrap flex-shrink-0">
            5 Hari Terakhir
          </span>
        </div>

        {hasAttendances ? (
          <div className="divide-y divide-slate-100">
            {attendances.map((item, index) => (
              <div
                key={item.id || `attendance-${index}`}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                      {/* photo url */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.photoUrl}`}
                        alt={item.date}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white border-2 border-white ${
                        item.status === "on_time"
                          ? "bg-emerald-500"
                          : "bg-indigo-600"
                      }`}
                    >
                      {item.status === "on_time" ? "✓" : "!"}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {item.date}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium truncate">
                      {item.timeIn} WIB -
                      {item.clockOutAt ? (
                        <>{item.timeOut} WIB</>
                      ) : (
                        <span className="text-[11px] text-amber-600 font-medium truncate">
                          {" "}
                          Belum Selesai{" "}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold flex-shrink-0 ${
                    item.status === "on_time"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70"
                      : "bg-indigo-50 text-indigo-700 border border-indigo-200/70"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.status === "on_time"
                        ? "bg-emerald-500"
                        : "bg-indigo-600"
                    }`}
                  />
                  <span>{item.statusLabel}</span>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50/80 border border-indigo-100/80 flex items-center justify-center text-indigo-600 shadow-xs">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-xs">
                  <ClockIcon className="w-3 h-3" />
                </div>
              </div>
            }
            title="Belum Ada Riwayat Absensi"
            description="Riwayat kehadiran 5 hari terakhir Anda akan otomatis muncul di sini setelah Anda melakukan presensi."
          />
        )}
      </div>

      {summary && (
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-900 tracking-tight">
              Ringkasan Kehadiran Bulan Ini
            </p>
            <span className="text-[10px] font-medium text-slate-400">
              {summary.period}
            </span>
          </div>
          {summary.period}

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-slate-500">
                  Total jam kerja
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-black text-slate-900 font-mono">
                  {summary.workHours.total}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Jam
                </span>
              </div>
              <p className="text-[9px] text-slate-400">
                Target min. {summary.workHours.target} jam
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-slate-500">
                  Keterlambatan
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-black text-amber-600 font-mono">
                  {summary.lateness.count}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Kali
                </span>
                <span
                  className={
                    summary.lateness.status === "Danger"
                      ? "text-red-500 font-semibold text-[9px]"
                      : "text-emerald-500 font-semibold text-[9px]"
                  }
                >
                  [{summary.lateness.status}]
                </span>
              </div>
              <p className="text-[9px] text-emerald-600 font-medium">
                Toleransi aman (&lt; {summary.lateness.maxAllowed}x)
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-slate-500">
                  Total Masuk
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-black text-slate-900 font-mono">
                  {summary.attendance.presentDays}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  / {summary.attendance.totalWorkingDays} Hari
                </span>
              </div>
              <p className="text-[9px] text-slate-400">
                {summary.attendance.remainingDays} hari tersisa
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-slate-500">
                  Tingkat Disiplin
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-black text-emerald-600 font-mono">
                  {summary.discipline.percentage}
                </span>
              </div>
              <p className="text-[9px] text-emerald-600 font-medium">
                Performa {summary.discipline.label}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
