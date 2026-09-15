import React from "react";
import { UsersIcon, CheckIcon, ShieldCheckIcon } from "@/presentation/components/common/icons";

interface UserStatsCardsProps {
  totalUsers: number;
  activeUsers: number;
  hrdCount: number;
  totalDivisions: number;
}

export const UserStatsCards: React.FC<UserStatsCardsProps> = ({
  totalUsers,
  activeUsers,
  hrdCount,
  totalDivisions,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Total Karyawan</span>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <UsersIcon className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{totalUsers}</p>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">Terdaftar di sistem</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Karyawan Aktif</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckIcon className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">{activeUsers}</p>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">Status akun aktif</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Tim HRD / Admin</span>
          <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <ShieldCheckIcon className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-black text-violet-600 font-mono">{hrdCount}</p>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">Hak akses manajerial</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Total Divisi</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-bold font-mono">
            DIV
          </div>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{totalDivisions}</p>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">Struktur departemen</p>
        </div>
      </div>
    </div>
  );
};
