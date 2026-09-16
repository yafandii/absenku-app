import React from "react";
import {
  UsersIcon,
  CheckIcon,
  ClockIcon,
} from "@/presentation/components/common/icons";
import { MonitorStats } from "../types";

interface MonitorStatsCardsProps {
  stats: MonitorStats;
}

export const MonitorStatsCards: React.FC<MonitorStatsCardsProps> = ({
  stats,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-5 shadow-xs space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500">
            Total Presensi
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <UsersIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div>
          <p className="text-lg sm:text-2xl font-black text-slate-900 font-mono">
            {stats.total}
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5 truncate">
            Karyawan telah hadir
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-5 shadow-xs space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500">
            Tepat Waktu
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div>
          <p className="text-lg sm:text-2xl font-black text-emerald-600 font-mono">
            {stats.onTime}
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5 truncate">
            Sebelum batas waktu
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-5 shadow-xs space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500">
            Terlambat
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div>
          <p className="text-lg sm:text-2xl font-black text-amber-600 font-mono">
            {stats.late}
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5 truncate">
            Lewat batas waktu
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-5 shadow-xs space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500">
            Belum Checkout
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-xs font-bold font-mono">
            WFH
          </div>
        </div>
        <div>
          <p className="text-lg sm:text-2xl font-black text-sky-600 font-mono">
            {stats.notCheckedOut}
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5 truncate">
            Masih berlangsung
          </p>
        </div>
      </div>
    </div>
  );
};
