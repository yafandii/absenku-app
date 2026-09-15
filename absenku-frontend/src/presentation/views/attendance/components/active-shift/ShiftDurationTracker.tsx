import React from "react";
import { ClockIcon } from "@/presentation/components/common/icons";
import { AttendanceEntity } from "@/domain/entities/attendance.entity";

interface ShiftDurationTrackerProps {
  attendanceRecord: AttendanceEntity;
  elapsedHours: number;
  remainingMinutes: number;
  progressPercent: number;
  isTargetCompleted: boolean;
}

export const ShiftDurationTracker: React.FC<ShiftDurationTrackerProps> = ({
  attendanceRecord,
  elapsedHours,
  remainingMinutes,
  progressPercent,
  isTargetCompleted,
}) => {
  const isLate = attendanceRecord.status !== "on_time";
  const statusLabel =
    attendanceRecord.statusLabel || (isLate ? "Terlambat" : "Tepat Waktu");

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-50/70 via-slate-50 to-indigo-50/40 border border-indigo-100/80 p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-indigo-100/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 flex-shrink-0">
            <ClockIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                Jam Masuk
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isLate
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {statusLabel}
              </span>
            </div>
            <p className="text-base sm:text-lg font-black text-slate-900 font-mono mt-0.5">
              {attendanceRecord.timeIn}{" "}
              <span className="text-xs font-semibold text-slate-400">WIB</span>
            </p>
          </div>
        </div>

        <div className="sm:text-right">
          <span className="text-xs font-semibold text-slate-500">
            Durasi Berjalan
          </span>
          <p className="text-base sm:text-lg font-black text-indigo-600 font-mono mt-0.5">
            {elapsedHours}{" "}
            <span className="text-xs font-semibold text-slate-400">Jam</span>{" "}
            {remainingMinutes}{" "}
            <span className="text-xs font-semibold text-slate-400">Menit</span>
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            Target Jam Kerja Harian
            <span className="text-[11px] font-normal text-slate-400">
              (Min. 8 Jam)
            </span>
          </span>
          <span
            className={`font-bold text-[11px] ${
              isTargetCompleted ? "text-emerald-600" : "text-slate-600"
            }`}
          >
            {progressPercent}% {isTargetCompleted && "✓ Terpenuhi"}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isTargetCompleted ? "bg-emerald-500" : "bg-indigo-600"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
